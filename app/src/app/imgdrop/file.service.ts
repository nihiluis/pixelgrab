import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import { z } from "zod"
import {
  CREATE_TAG_API_URL,
  TAG_API_URL as GET_TAGS_API_URL,
  UPLOAD_API_URL,
} from "../constants"
import { Observable, map } from "rxjs"

type UploadFileApiResponse = z.infer<typeof UploadFileApiResponse>

const UploadFileApiResponse = z.object({
  entry: z.object({
    id: z.string(),
    originalFilename: z.string(),
    location: z.string(),
  }),
})

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
}
