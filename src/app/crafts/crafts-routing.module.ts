import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CraftsLayoutComponent } from './layouts/crafts-layout/crafts-layout.component';
import { isNotAdminGuard } from './guards/is-not-admin.guard';
import { InfoComponent } from './pages/info/info.component';
import { CraftTableComponent } from './pages/admin/craft/craft-table/craft-table.component';
import { CraftAddComponent } from './pages/admin/craft/craft-add/craft-add.component';
import { CraftEditComponent } from './pages/admin/craft/craft-edit/craft-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CraftsLayoutComponent,
    children: [
      {
        path: '',
        component: InfoComponent,
        pathMatch: 'full',
      },
      {
        path: 'admin',
        canActivate: [isNotAdminGuard],
        component: CraftTableComponent,
      },
      {
        path: 'admin/add',
        canActivate: [isNotAdminGuard],
        component: CraftAddComponent,
      },
      {
        path: 'admin/edit/:id',
        canActivate: [isNotAdminGuard],
        component: CraftEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CraftsRoutingModule {}
