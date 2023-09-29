import express from "express"
import multer from "multer"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const app = express()
const port = process.env.PORT || 3333

const prisma = new PrismaClient()

app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:4200", // Replace with the URL of your Angular app
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
  const { title } = req.body
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

  res.status(200).json({ tag, isNew })
})

// Endpoint for handling file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." })
  }

  const filename = req.file.originalname
  const fileBuffer = req.file.buffer

  console.log(filename)

  return res.status(200).json({ message: "File uploaded successfully." })
})

// Start the Express server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

server.on("close", () => {
  prisma.$disconnect()
})
