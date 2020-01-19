import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@/import';
import { HeaderComponent } from './header';

const ExportDeclarations = [
  HeaderComponent,
];
const ExportModules = [
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  CommonModule,
  MaterialModule,
];

@NgModule({
  imports: ExportModules,
  declarations: [
    ...ExportDeclarations,
  ],
  exports: [
    ...ExportDeclarations,
    ...ExportModules,
  ],
})
export class SharedModule { }
