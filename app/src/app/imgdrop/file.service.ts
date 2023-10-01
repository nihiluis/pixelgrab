import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import { z } from "zod"
import {
  CREATE_TAG_API_URL,
  TAG_API_URL as GET_TAGS_API_URL,
  SEARCH_API_URL,
  UPLOAD_API_URL,
} from "../constants"
import { Observable, map } from "rxjs"
import { Tag, TagZodObject } from "../tag/tag.service"

type UploadFileApiResponse = z.infer<typeof UploadFileApiResponse>
type SearchApiResponse = z.infer<typeof SearchApiResponse>

export const EntryZodObject = z.object({
  id: z.string(),
  originalFilename: z.string(),
  location: z.string(),
  tags: z.array(TagZodObject),
})

const UploadFileApiResponse = z.object({
  entry: EntryZodObject,
})

const SearchApiResponse = z.object({
  entries: z.array(EntryZodObject),
})

export interface ImageEntry {
  id: string
  originalFilename: string
  location: string
  tags: Tag[]
}

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param file
   * @returns the created file id
   */
  uploadFile(file: File): Observable<UploadFileApiResponse["entry"]> {
    if (!file) {
      throw new Error("file must be provided")
    }
    const formData = new FormData()
    formData.append("file", file)

    return this.http
      .post(UPLOAD_API_URL, formData)
      .pipe(map(res => UploadFileApiResponse.parse(res).entry))
  }

  searchFiles(
    page: number,
    tags: Tag[]
  ): Observable<SearchApiResponse["entries"]> {
    let url = `${SEARCH_API_URL}?page=${page}`
    if (tags.length > 0) {
      url += "&tags=" + tags.map(t => t.id).join(",")
    }
    return this.http
      .get(url)
      .pipe(map(res => SearchApiResponse.parse(res).entries))
  }
}
