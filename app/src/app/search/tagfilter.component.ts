import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core"
import { Tag, TagService } from "../tag/tag.service"

@Component({
  selector: "app-tagfilter",
  templateUrl: "./tagfilter.component.html",
})
export class TagFilterComponent implements OnInit {
  allTags: Tag[] = []
  selectedTags: Tag[] = []

  @Output() selectedTagsEvent = new EventEmitter<Tag[]>()

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.getTags().subscribe(tags => {
      this.allTags = tags
    })
  }

  onSelectedTagsChange(event: any): void {
    this.selectedTagsEvent.emit(this.selectedTags)
  }
}
