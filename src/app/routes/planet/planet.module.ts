import { NgModule } from '@angular/core';

import { SharedModule } from '@/shared';
import { PlanetComponent } from './planet.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    PlanetComponent,
  ],
})
export class PlanetModule { }
