import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import { InputDataDashboardComponent } from './dashboards/input-data-dashboard/input-data-dashboard.component';
import { TableDashboardComponent } from './dashboards/table-dashboard/table-dashboard.component';
import { AddPointDashboardComponent } from './dashboards/add-point-dashboard/add-point-dashboard.component';
import { BlocksTableComponent } from './dashboards/blocks-table/blocks-table.component';
import { ReportFormComponent } from './dashboards/report-form/report-form.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: InputDataDashboardComponent },
  { path: 'tabledash', component: TableDashboardComponent },//
  { path: 'addpoint', component: AddPointDashboardComponent },//
  { path: 'blocks', component: BlocksTableComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportFormComponent},
  { path: '**', component: HomeComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
