import { Component, OnInit } from "@angular/core"
import { FileService, ImageEntry } from "../imgdrop/file.service"
import { Tag } from "../tag/tag.service"

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.css"],
})
export class GalleryComponent implements OnInit {
  allEntries: ImageEntry[] = []
  selectedEntry: ImageEntry | null = null

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.fileService.searchFiles(1, []).subscribe(entries => {
      this.allEntries = entries
    })
  }

  handleClick(entry: ImageEntry) {
    this.selectedEntry = entry
  }

  handleSelectedTagsChange(newSelectedTags: Tag[]) {
    this.fileService.searchFiles(1, newSelectedTags).subscribe(entries => {
      this.allEntries = entries
      this.selectedEntry = null
    })
  }
}
