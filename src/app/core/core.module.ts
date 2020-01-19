import { NgModule } from '@angular/core';

import {
  BioService,
} from './services';

@NgModule({
  providers: [
    BioService,
  ],
})
export class CoreModule { }
