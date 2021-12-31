import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DynamicDialogFormComponent } from '../dynamic-dialog-form/dynamic-dialog-form.component';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment'
import { InputCfg } from '../input-cfg-model';
import { DbPointCfg } from '../db-point-model';
import { PointValue, ValuesResponse } from '../point-value-model';

@Component({
  selector: 'app-create-value-dialog-btn',
  templateUrl: './create-value-dialog-btn.component.html',
  styleUrls: ['./create-value-dialog-btn.component.css']
})
export class CreateValueDialogBtnComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient) { }
  
  @Input() point: Number;
  @Input() caption: string = "New...";
  @Input() gasday: string = "2021-12-01";
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();
  
  fTitle: string = "";
  inputs: InputCfg[] = [];

  ngOnInit() {
  }

  showDialog() {
    this.getPointInfo(this.point).subscribe( pntInfo=>{
        //alert(JSON.stringify(res));point.data.options
        this.getPointValue(this.point, this.gasday).subscribe( val=> {
          const inp = this.createControls(this.gasday, pntInfo.data, val.data[0]);
          this.openDialog(pntInfo.data, inp);          
        });      
      });
  }
 
  openDialog(point:DbPointCfg, inputs: InputCfg[]){
    let dialogRef = this.dialog.open(DynamicDialogFormComponent, {
      disableClose : true,
      autoFocus : true,
      data: { 
        //title: title, 
        inputs: inputs
      },
    });
    
    dialogRef.afterClosed().subscribe(res => {
      //console.log(`Dialog result: ${result}`);
      //alert(JSON.stringify(res));
      if (!res) return;

      const kvp = point.options? point.options.kvp.find(kvp=>kvp.key==res.value) : null;
      const newState = kvp ? kvp.value : "Normal";
      const newVal = { 
        value: res.value, 
        time_stamp: res.date+"T"+res.time, 
        point: point._id, 
        state: newState,
        user: 6 
      }; 
      this.postNewValue(newVal).subscribe(res=>{
        //alert(JSON.stringify(res));
        this.changed.emit(res);
      });
    });
 }
  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options`);
  }
  getPointValue(point:Number, gasday: string) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/values?point=${point}&time_stamp[$lte]=${gasday}&sort=-created_at&limit=1`);
  }
  postNewValue(value:any) : Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/values`, value);
  }
  createControls(gasday:string, pointCfg:DbPointCfg,  current:PointValue): InputCfg[] {
    //alert(JSON.stringify(current));
    return [
      {
        "id": "date",
        "name": "date",
        "label": "Дата",
        "value": gasday.split("T")[0],
        "type": "date",
        "min": "0",
        "max": "3",
        "step": "1",
        "options": []
      },
      { 
        "id": "time",
        "name": "time",
        "label": "Час",
        "value": gasday.split("T")[1].split(".")[0],
        "type": "time",
      },
      {
        "id": "value",
        "name": "value",
        "label": pointCfg.name,
        "value": `${current ? current.value : ""}`,
        "type": pointCfg.type,
        "min": pointCfg.min,
        "max": pointCfg.max,
        "step": pointCfg.step,
        "options": pointCfg.options? pointCfg.options.kvp : []
      },  
    ];
  }

}
