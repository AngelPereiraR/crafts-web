import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';
import { CraftsLayoutComponent } from './layouts/crafts-layout/crafts-layout.component';
import { CraftsRoutingModule } from './crafts-routing.module';
import { InfoComponent } from './pages/info/info.component';


@NgModule({
  declarations: [
    CommonBackgroundComponent,
    CraftsLayoutComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    CraftsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
})
export class CraftsModule {}
