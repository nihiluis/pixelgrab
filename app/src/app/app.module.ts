import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { DropzoneModule } from "ngx-dropzone-wrapper"
import { TagFormComponent } from "./tag/tag-form.component"
import { AutoCompleteModule } from "primeng/autocomplete"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { TagService } from "./tag/tag.service"
import { ImgdropComponent } from "./imgdrop/imgdrop.component"
import { HomeComponent } from "./home/home.component"

@NgModule({
  declarations: [
    AppComponent,
    TagFormComponent,
    ImgdropComponent,
    HomeComponent,
  ],
  imports: [
    DropzoneModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    HttpClientModule,
  ],
  providers: [TagService],
  bootstrap: [AppComponent],
})
export class AppModule {}
