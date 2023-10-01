import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

import { z } from "zod"
import {
  CREATE_TAG_API_URL,
  TAG_API_URL as GET_TAGS_API_URL,
} from "../constants"
import { Observable, map } from "rxjs"

type GetTagsApiResponse = z.infer<typeof GetTagsApiResponse>
type CreateTagApiResponse = z.infer<typeof CreateTagApiResponse>

export interface Tag {
  title: string
  id: number
}

export const TagZodObject = z.object({
  title: z.string(),
  id: z.number(),
})
const GetTagsApiResponse = z.object({
  tags: z.array(TagZodObject),
})

const CreateTagApiResponse = z.object({
  tag: TagZodObject,
  isNew: z.boolean(),
})

@Injectable({
  providedIn: "root",
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<GetTagsApiResponse["tags"]> {
    return this.http
      .get(GET_TAGS_API_URL)
      .pipe(map(res => GetTagsApiResponse.parse(res).tags))
  }

  getOrCreateTag(
    title: string,
    imageEntryId: string | null
  ): Observable<CreateTagApiResponse["tag"]> {
    return this.http
      .post(CREATE_TAG_API_URL, {
        title,
        imageEntryId,
      })
      .pipe(map(res => CreateTagApiResponse.parse(res).tag))
  }
}
