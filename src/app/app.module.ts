import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneTableComponent } from './scene-table/scene-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Add this line
// import { OpenAI } from './openai.module';

@NgModule({
  declarations: [AppComponent, SceneTableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // OpenAI,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
