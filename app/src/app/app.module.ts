import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { DropzoneCdkModule } from "@ngx-dropzone/cdk"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { TagFormComponent } from "./tag/tag-form.component"
import { AutoCompleteModule } from "primeng/autocomplete"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { TagService } from "./tag/tag.service"
import { ImgdropComponent } from "./imgdrop/imgdrop.component"
import { HomeComponent } from "./home/home.component"
import { MyDropzoneComponent } from "./imgdrop/mydropzone.component"
import { FileService } from "./imgdrop/file.service";
import { GalleryComponent } from './gallery/gallery.component';
import { SearchComponent } from './search/search.component'

@NgModule({
  declarations: [
    AppComponent,
    TagFormComponent,
    ImgdropComponent,
    HomeComponent,
    MyDropzoneComponent,
    GalleryComponent,
    SearchComponent,
  ],
  imports: [
    DropzoneCdkModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    HttpClientModule,
  ],
  providers: [TagService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {}
