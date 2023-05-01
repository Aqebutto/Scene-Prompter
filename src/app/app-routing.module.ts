import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SceneTableComponent } from './scene-table/scene-table.component';


const routes: Routes = [
  {
    path: '',
    component: SceneTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
