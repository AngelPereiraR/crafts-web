import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SpinnerComponent } from '../shared/components/spinner/spinner.component';
import { CommonBackgroundComponent } from './components/common-background/common-background.component';
import { CraftsLayoutComponent } from './layouts/crafts-layout/crafts-layout.component';
import { CraftsRoutingModule } from './crafts-routing.module';
import { InfoComponent } from './pages/info/info.component';
import { CraftTableComponent } from './pages/admin/craft/craft-table/craft-table.component';
import { CraftAddComponent } from './pages/admin/craft/craft-add/craft-add.component';
import { CraftEditComponent } from './pages/admin/craft/craft-edit/craft-edit.component';


@NgModule({
  declarations: [
    CommonBackgroundComponent,
    CraftsLayoutComponent,
    CraftTableComponent,
    CraftAddComponent,
    CraftEditComponent,
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
