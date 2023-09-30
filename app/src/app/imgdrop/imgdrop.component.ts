import { Component } from "@angular/core"
import { FormControl } from "@angular/forms"
import { FileInputValidators, FileInputValue } from "@ngx-dropzone/cdk"
import { DropzoneConfigInterface, DropzoneModule } from "ngx-dropzone-wrapper"
import { FileService } from "./file.service"

@Component({
  selector: "app-imgdrop",
  templateUrl: "./imgdrop.component.html",
  styleUrls: ["./imgdrop.component.css"],
})
export class ImgdropComponent {
  dropzoneConfig: DropzoneConfigInterface = {
    url: "http://localhost:3333/upload", // Replace with your upload URL
    maxFilesize: 1, // Maximum file size in MB
    acceptedFiles: "image/*", // Accepted file types
    autoProcessQueue: true, // Don't automatically process uploaded files
  }

  validators = [FileInputValidators.accept("image/*")]
  profileImg = new FormControl<FileInputValue>(null, this.validators)

  constructor(private fileService: FileService) {
    this.profileImg.statusChanges.subscribe(value => {
      const potentialFile = this.profileImg.value
      if (!potentialFile) {
        console.error("retrieved invalid file")
        return
      }

      const file = potentialFile as File

      fileService.uploadFile(file).subscribe({
        next: imageEntry => {
          console.log(JSON.stringify(imageEntry))
        },
        error: err => {
          console.error(err)
        },
      })

      console.log(file.name)
    })
  }
}
