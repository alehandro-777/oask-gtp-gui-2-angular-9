import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import { InputDataDashboardComponent } from './dashboards/input-data-dashboard/input-data-dashboard.component';
import { TableDashboardComponent } from './dashboards/table-dashboard/table-dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: InputDataDashboardComponent },
  { path: 'tabledash', component: TableDashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: HomeComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
