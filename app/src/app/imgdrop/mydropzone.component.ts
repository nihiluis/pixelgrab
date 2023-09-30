import { Component } from "@angular/core"
import { DropzoneComponent } from "@ngx-dropzone/cdk"
import { Observable, Subject, merge, takeUntil, tap } from "rxjs"

@Component({
  selector: "my-dropzone",
  template: `
    <div class="cursor-pointer text-center p-4 bg-gray-100 rounded-full" (click)="onContainerClick()">
      <label>Click or drop your file here.</label>
      <ng-content select="[fileInput]"></ng-content>
    </div>
  `,
  styles: [
    `
      .my-dropzone {
        cursor: pointer;
        text-align: center;
        padding: 40px;
        background: platinum;
        border: 1px solid black;
      }

      .dragover > .my-dropzone {
        border-width: 2px;
      }
    `,
  ],
})
export class MyDropzoneComponent extends DropzoneComponent {
  stateChanges = new Subject<void>()

  override ngAfterContentInit() {
    super.ngAfterContentInit()

    // Forward the stateChanges from the fileInputDirective to the MatFormFieldControl
    const stateEvents: Observable<unknown>[] = [this.dragover$]
    if (this.fileInputDirective)
      stateEvents.push(this.fileInputDirective.stateChanges)

    merge(...stateEvents)
      .pipe(
        tap(() => this.stateChanges.next()),
        takeUntil(this._destroy$)
      )
      .subscribe()
  }

  onContainerClick(): void {
    this.openFilePicker()
  }
}
