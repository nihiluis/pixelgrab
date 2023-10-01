import express from "express"
import multer from "multer"
import cors from "cors"
import {
  ImageEntry,
  Prisma,
  PrismaClient,
  Tag,
  TagInImageEntry,
} from "@prisma/client"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getFileExtension } from "./utils"
import { z } from "zod"

const app = express()
const port = process.env.PORT || 3333

const prisma = new PrismaClient()

const s3Region = process.env.AWS_REGION!
const s3Bucket = process.env.AWS_S3_BUCKET_NAME!

const allowOrigins = process.env.ALLOW_ORIGINS ?? "http://localhost:4200"

const s3 = new S3Client({
  region: s3Region,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  },
})

app.use(express.json())
app.use(
  cors({
    origin: allowOrigins, // Replace with the URL of your Angular app
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the HTTP methods allowed
    // allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
  })
)

// Multer configuration for handling file uploads
const storage = multer.memoryStorage()

const upload = multer({ storage })

app.get("/tags", async (req, res) => {
  const tags = await prisma.tag.findMany()

  res.status(200).json({ tags })
})

app.post("/tag", async (req, res) => {
  const { title, imageEntryId } = req.body
  if (!title) {
    return res.status(400).json({ message: "Title cannot be empty." })
  }
  if (title.length > 32) {
    return res
      .status(400)
      .json({ message: "Title cannot have more than 32 characters." })
  }

  let isNew = false
  let tag = await prisma.tag.findFirst({
    where: { title },
  })

  if (!tag) {
    tag = await prisma.tag.create({ data: { title } })
    isNew = true
  }

  let createdTag = false
  if (imageEntryId) {
    await prisma.tagInImageEntry.create({
      data: { tagId: tag.id, imageEntryId },
    })
    createdTag = true
  }

  res.status(200).json({ tag, isNew, createdTag })
})

export const searchSchema = z.object({
  page: z.coerce.number().min(1).max(99).default(1),
  tags: z.array(z.coerce.number().min(0)).default([]),
})

app.get("/search", async (req, res) => {
  const ITEMS_PER_PAGE = 10

  const tagsTheEntryShouldHaveStr = (req.query.tags as string) ?? ""
  const tagsTheEntryShouldHaveRaw = tagsTheEntryShouldHaveStr
    .split(",")
    .filter(tag => tag.length > 0)

  const validationObj = { ...req.query, tags: tagsTheEntryShouldHaveRaw }
  const parsedInput = searchSchema.parse(validationObj)

  const { tags: tagsTheEntryShouldHave, page } = parsedInput

  type ImageEntryWithTags = ImageEntry & { tags: Tag[] }
  let entries: ImageEntryWithTags[]

  const skipOffset = ITEMS_PER_PAGE * (page - 1)

  if (tagsTheEntryShouldHaveRaw.length === 0) {
    const entriesResult = await prisma.imageEntry.findMany({
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (page - 1),
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    entries = entriesResult.map(e => ({ ...e, tags: e.tags.map(t => t.tag) }))
  } else {
    const query = Prisma.sql`SELECT 
    ie.*,
    subquery.tags
    FROM "ImageEntry" ie
    JOIN (
        SELECT 
        it."imageEntryId",
        JSON_AGG(JSON_BUILD_OBJECT('id', t.id, 'title', t.title)) AS tags
        FROM "TagInImageEntry" it
        JOIN "Tag" t ON it."tagId" = t.id
        WHERE t.id IN (${Prisma.join(tagsTheEntryShouldHave)})
        GROUP BY it."imageEntryId"
        HAVING COUNT(DISTINCT t.id) = ${tagsTheEntryShouldHave.length}
    ) subquery ON ie.id = subquery."imageEntryId"
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${skipOffset};
    `

    entries = await prisma.$queryRaw(query) as ImageEntryWithTags[]
  }
  return res.status(200).json({ message: "", entries })
})

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." })
  }

  const filename = req.file.originalname
  const fileBuffer = req.file.buffer
  const fileExtension = getFileExtension(filename)

  try {
    const uuid = crypto.randomUUID()

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
        Key: uuid + "." + fileExtension,
        Body: fileBuffer,
      })
    )

    const location = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${uuid}.${fileExtension}`

    const entry = await prisma.imageEntry.create({
      data: { originalFilename: filename, location },
    })

    return res
      .status(200)
      .json({ message: "File uploaded to S3 successfully.", entry })
  } catch (err: any) {
    console.error("Error uploading to S3:", err)
    return res.status(500).json({ message: "Error uploading to S3." })
  }
})

// Start the Express server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

server.on("close", () => {
  prisma.$disconnect()
})
