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

import {TableComponent} from './tables/table.component';
import { HtmlInputComponent } from './forms/input/input.component';
import { DynamicDialogFormComponent } from './forms/dynamic-dialog-form/dynamic-dialog-form.component';


import {LoaderInterceptor} from './shared/loader-http-interceptor';
import {AuthInterceptor} from './shared/auth-interceptor';
import { LoginComponent } from './login/login.component';
import { LoaderComponent } from './loader/loader.component';
import { DynamicFormComponent } from './forms/dynamic-form/dynamic-form/dynamic-form.component';
import { HomeComponent } from './home/home.component';

import { EditProductComponent } from './admin/product/edit-product/edit-product.component';
import { EditUserComponent } from './admin/user/edit-user/edit-user/edit-user.component';
import { UsersListComponent } from './admin/user/users-list/users-list/users-list.component';
import { FileUploadComponent } from './file-upload/file-upload/file-upload.component';
import { TreeMenuComponent } from './tree-menu/tree-menu.component';
import { RegimComponent } from './reports/regim/regim.component';


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

    EditProductComponent,
    EditUserComponent,
    UsersListComponent,
    FileUploadComponent,
    TreeMenuComponent,
    RegimComponent,
   
    
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
