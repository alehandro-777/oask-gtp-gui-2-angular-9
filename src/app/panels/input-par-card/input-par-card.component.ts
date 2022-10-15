import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment'
import { DynamicDialogFormComponent } from 'src/app/forms/dynamic-dialog-form/dynamic-dialog-form.component';
import { InputCfg } from 'src/app/forms/input-cfg-model';
import { DbPointCfg } from 'src/app/forms/db-point-model';
import { PointValue } from 'src/app/forms/point-value-model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';

@Component({
  selector: 'app-input-par-card',
  templateUrl: './input-par-card.component.html',
  styleUrls: ['./input-par-card.component.css']
})
export class InputParCardComponent implements OnInit, OnDestroy {

  @Input() point: Number =1;
  @Input() dt: string = "2021-12-01T07:00";
  
  user : User; 
  pntInfo : any = {};
  pntValue : PointValue;

  calcValue : PointValue;

  displayValue : string = "---";
  isDigitalObject : boolean = false;
  isDeleted : boolean = false;
  isCalculated : boolean = false;
  isBlocked : boolean = false;

  private dtSubscription: Subscription;

  constructor(public dialog: MatDialog, private http: HttpClient, private _authService : AuthenticationService) { 

 
  }
 
  ngOnInit() {
    this.user = this._authService.userValue;
    this.loadInfo();
    //this.loadValue();
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log(JSON.stringify(s), this.user); 
      this.dt = isoDt; 
      this.loadValue();
    });
  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
  } 

  ngOnChanges(changes: SimpleChanges) {
    /*
    for (const propName in changes) {
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
    }
    */
    this.loadValue();
  }

  setUnkownDisplay(){
    this.pntValue = null;
    this.displayValue  = "---";
  }

  setGoodDisplay(pntValue) {
    
    this.pntValue = pntValue;
    this.isDeleted = pntValue.deleted;
    this.isBlocked = false;   //TODO TODO


    if (this.isDigitalObject) {
      this.displayValue  = pntValue.state;
    } else {
      this.displayValue  = pntValue.value;
    }
    
  }

  loadInfo() {
    this.getPointInfo(this.point).subscribe( pntInfo=>{
        //alert(JSON.stringify(...));
        this.pntInfo = pntInfo.data;
        this.isCalculated = this.pntInfo.func ? true : false; 
 
        if (this.pntInfo.type == "select") {
          this.isDigitalObject = true;
        } else {
          this.isDigitalObject = false;
        }    
    });
  }

  showDialog() {
    const day = this.dt.split("T")[0];
    const time = this.dt.split("T")[1];
    let inp;

    if (this.isCalculated) { 
      inp = this.createControls(day, this.pntInfo, this.calcValue, time);
    } else {
      inp = this.createControls(day, this.pntInfo, this.pntValue, time);
    } 

    this.openDialog(this.pntInfo, inp);   
  }

  loadValue() {
    this.getPointValue(this.point, this.dt).subscribe( val=> {
      this.setGoodDisplay(val.data);
      //alert(JSON.stringify(this.pntValue));
    },
      (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.setUnkownDisplay();
        };
      }
    );

    if (this.isCalculated) this.getCalcValue(this.point, this.dt).subscribe( cval=>{
      this.calcValue = cval.data;
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
        user: this.user._id, 
      }; 
      this.postNewValue(newVal).subscribe(res=>{
        //alert(JSON.stringify(res));
        this.loadValue();
      });
    });
 }
  
  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options`);
  }
  
  getPointValue(point:Number, dt: string) : Observable<any> {
    if (this.isDigitalObject) 
      return this.http.get<any>(`${environment.apiUrl}/db-points/${point}/state?time_stamp=${dt}`);
    else
      return this.http.get<any>(`${environment.apiUrl}/db-points/${point}/value?time_stamp=${dt}`);
  }

  getCalcValue(point:Number, dt: string) : Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/db-points/${point}/calc?time_stamp=${dt}`);
  }

  postNewValue(value:any) : Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/values`, value);
  }
  
  createControls(gasday:string, pointCfg:DbPointCfg,  current:PointValue, time:string): InputCfg[] {
    //alert(JSON.stringify(current));
    return [
      {
        "id": "date",
        "name": "date",
        "label": "Дата",
        "value": gasday,
        "type": "date",
        "min": "0",
        "max": "3",
        "step": "1",
        "options": []
      },
      {
        "id": "time",
        "name": "time",
        "label": "Година",
        "value": time,
        "type": "time",
      },
      {
        "id": "value",
        "name": "value",
        "label": pointCfg.name,
        "value": this.formatValue(pointCfg, current),
        "type": pointCfg.type,
        "min": pointCfg.min,
        "max": pointCfg.max,
        "step": pointCfg.step,
        "options": pointCfg.options? pointCfg.options.kvp : []
      },  
    ];
  }

  formatValue(pointCfg:DbPointCfg,  current:PointValue) :string{
    if (current) {
      let dec = +pointCfg.step;       // ???? TODO TODO
      return current.value.toFixed(3);
    } else {
      return "";
    }
  }

}
