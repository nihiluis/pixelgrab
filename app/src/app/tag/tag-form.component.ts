import { Component, OnInit } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { Tag, TagService } from "./tag.service"
import Fuse from "fuse.js"

interface AutoCompleteCompleteEvent {
  originalEvent: Event
  query: string
}

@Component({
  selector: "app-tag-form",
  templateUrl: "./tag-form.component.html",
  styleUrls: ["./tag-form.component.css"],
})
export class TagFormComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    selectedTags: new FormControl<object[]>([]),
    autocompleteTagText: new FormControl<object | null>(null),
  })
  allTags: Tag[] = []
  filteredAutocompleteTags: any[] = []
  private fuseOptions = {
    includeScore: true,
    keys: ["title"],
  }

  fuse = new Fuse<Tag>([], this.fuseOptions)

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagService.getTags().subscribe(tags => {
      this.allTags = tags

      this.fuse = new Fuse(this.allTags, this.fuseOptions)
    })
  }

  filterTags(event: AutoCompleteCompleteEvent) {
    if (!this.allTags) {
      return
    }

    let query = event.query

    const result = this.fuse.search(query)

    this.filteredAutocompleteTags = result.map(resItem => resItem.item)
  }

  onAddTag() {
    let tagTitle = this.formGroup.get("autocompleteTagText")?.value ?? ""
    // the autocomplete content sets an object as the form value which is inconsistent to when you type manually
    if (typeof tagTitle !== "string") {
      tagTitle = tagTitle.title
    }

    const selectedTags: string[] =
      this.formGroup.get("selectedTags")?.value?.map((tag: Tag) => tag.title) ??
      []

    if (selectedTags.includes(tagTitle)) {
      return
    }

    if (!tagTitle) {
      return
    }

    this.tagService.getOrCreateTag(tagTitle).subscribe({
      next: newTag => {
        const tagsFormControl = this.formGroup.get("selectedTags")
        this.formGroup.get("autocompleteTagText")?.setValue(null)
        if (!tagsFormControl) {
          console.warn("unable to find formcontrol selectedTags")
          return
        }

        const existingTags = tagsFormControl.value ?? []

        this.allTags = [...this.allTags, newTag]
        this.fuse.add(newTag)

        tagsFormControl.setValue([...existingTags, newTag])
      },
      error: err => {},
    })
  }
}
