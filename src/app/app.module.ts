import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatRadioModule} from '@angular/material/radio';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatTreeModule} from '@angular/material/tree';
import {MatGridListModule} from '@angular/material/grid-list';

import {TableComponent} from './tables/table.component';
import { HtmlInputComponent } from './forms/input/input.component';
import { DynamicDialogFormComponent } from './forms/dynamic-dialog-form/dynamic-dialog-form.component';


import {LoaderInterceptor} from './shared/loader-http-interceptor';
import {AuthInterceptor} from './shared/auth-interceptor';
import { LoginComponent } from './login/login.component';
import { LoaderComponent } from './loader/loader.component';
import { DynamicFormComponent } from './forms/dynamic-form/dynamic-form/dynamic-form.component';
import { HomeComponent } from './home/home.component';


import { FileUploadComponent } from './file-upload/file-upload/file-upload.component';
import { TreeMenuComponent } from './tree-menu/tree-menu.component';
import { ComplexTableComponent } from './tables/complex-table/complex-table.component';
import { CreateValueDialogBtnComponent } from './forms/create-value-dialog-btn/create-value-dialog-btn.component';
import { InputParCardComponent } from './panels/input-par-card/input-par-card.component';
import { InputDataDashboardComponent } from './dashboards/input-data-dashboard/input-data-dashboard.component';
import { TableCardComponent } from './panels/table-card/table-card.component';
import { PointInfoCardComponent } from './panels/point-info-card/point-info-card.component';
import { ControlPanelBtnComponent } from './dashboards/control-panel-btn/control-panel-btn.component';
import { ControlPanelComponent } from './dashboards/control-panel/control-panel.component';
import { TableDashboardComponent } from './dashboards/table-dashboard/table-dashboard.component';
import { TableHtmlCardComponent } from './panels/table-html-card/table-html-card.component';
import { ButtonsMenuComponent } from './tree-menu/buttons-menu/buttons-menu.component';
import { InputParRowComponent } from './panels/input-par-row/input-par-row.component';
import { SafeHtmlPipe } from './shared/safe-html.pipe';
import { AddPointDashboardComponent } from './dashboards/add-point-dashboard/add-point-dashboard.component';
import { InputParCellComponent } from './panels/input-par-cell/input-par-cell.component';
import { CalcParCellComponent } from './panels/calc-par-cell/calc-par-cell.component';
import { BlocksTableComponent } from './dashboards/blocks-table/blocks-table.component';
import { ReadonlyParCellComponent } from './panels/readonly-par-cell/readonly-par-cell.component';
import { InputNumberComponent } from './dashboard-input/input-number/input-number.component';
import { ViewNumberComponent } from './dashboard-input/view-number/view-number.component';
import { ReportFormComponent } from './dashboards/report-form/report-form.component';

   

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    DynamicDialogFormComponent,
    HtmlInputComponent,
    LoginComponent,
    LoaderComponent,
    DynamicFormComponent,
    HomeComponent,

    FileUploadComponent,
    TreeMenuComponent,
    ComplexTableComponent,
    CreateValueDialogBtnComponent,
    InputParCardComponent,
    InputDataDashboardComponent,
    TableCardComponent,
    PointInfoCardComponent,
    ControlPanelBtnComponent,
    ControlPanelComponent,
    TableDashboardComponent,
    TableHtmlCardComponent,
    ButtonsMenuComponent,
    InputParRowComponent,
    SafeHtmlPipe,
    AddPointDashboardComponent,
    InputParCellComponent,
    CalcParCellComponent,
    BlocksTableComponent,
    ReadonlyParCellComponent,
    InputNumberComponent,
    ViewNumberComponent,
    ReportFormComponent,

   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatRadioModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatChipsModule,
    FlexLayoutModule,
    MatTreeModule,
    MatGridListModule,
    
  ],
  entryComponents: [
    DynamicDialogFormComponent

  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
