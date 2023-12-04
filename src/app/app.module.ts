import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneTableComponent } from './scene-table/scene-table.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Add this line

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { OpenAI } from './openai.module';

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { TextRewriteComponent } from './text-rewrite/text-rewrite.component';

@NgModule({
  declarations: [AppComponent, SceneTableComponent, TextRewriteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule,
    // OpenAI,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
