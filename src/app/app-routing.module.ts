import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  title: 'Planes - BEFIT4U',
  loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule)
},
{
  path: 'form', loadChildren: () => import('./pages/form/form.module').then(m => m.FormModule)
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
