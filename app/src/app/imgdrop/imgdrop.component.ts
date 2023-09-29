import { Component } from "@angular/core"
import { DropzoneConfigInterface, DropzoneModule } from "ngx-dropzone-wrapper"

@Component({
  selector: "app-imgdrop",
  templateUrl: "./imgdrop.component.html",
  styleUrls: ["./imgdrop.component.css"],
})
export class ImgdropComponent {
  dropzoneConfig: DropzoneConfigInterface = {
    url: "http://localhost:3000/upload", // Replace with your upload URL
    maxFilesize: 1, // Maximum file size in MB
    acceptedFiles: "image/*", // Accepted file types
    autoProcessQueue: true, // Don't automatically process uploaded files
  }

  constructor() {}

  onFileDrop(event: any) {
    // Handle dropped files here
    console.log(event)
  }

  onUploadError(event: any) {
    console.log("upload error")
  }

  onUploadSuccess(event: any) {
    console.log("upload success")
  }
}
