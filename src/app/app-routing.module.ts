import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  PlanetComponent,
} from '@/routes';

const appRoutes: Routes = [
  { path: '', component: PlanetComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
