import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneTableComponent } from './scene-table/scene-table.component';
import { TextRewriteComponent } from './text-rewrite/text-rewrite.component';

const routes: Routes = [
  { path: 'scenes', component: SceneTableComponent },
  { path: 'text-rewrite', component: TextRewriteComponent },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
