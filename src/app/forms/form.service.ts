import { Injectable } from '@angular/core';
import {InputCfg} from './input-cfg-model'
import {DynamicFormModel} from './form.model'
import { from, Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {DynamicDialogFormComponent} from './dynamic-dialog-form/dynamic-dialog-form.component';
import {environment} from '../../environments/environment'
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) { }

  openDialog(form_id : string){
    this.getDynamicFormConfig(form_id).subscribe(
      data=>{
        const dialogConfig = new MatDialogConfig();
        //dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        dialogConfig.data = {};
        dialogConfig.data.title = data.title;
        dialogConfig.data.inputs = data.controls;
      
        const dialogRef = this.dialog.open(DynamicDialogFormComponent, dialogConfig);
      
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.postFormData('form_id', result).subscribe(result => {
            });
          };
        });

    });//getDynamicFormConfig
  
  }

getDynamicFormConfig(form_id : string) : Observable<DynamicFormModel> {

  return this.http.get<any>(`${environment.apiUrl}/forms/${form_id}`);

}

postFormData(form_id : string, form_data : any) {
  //alert(JSON.stringify(json));
  return this.http.post<any>(`${environment.apiUrl}/formvalues`, form_data );
}

}

