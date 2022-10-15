import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment'
import { DbPointCfg } from 'src/app/forms/db-point-model';
import { PointValue } from 'src/app/forms/point-value-model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';
import { SmartDate } from '../../models/smart-date';

@Component({
  selector: 'app-input-par-row',
  templateUrl: './input-par-row.component.html',
  styleUrls: ['./input-par-row.component.css']
})
export class InputParRowComponent implements OnInit, OnDestroy {
  @Input() point: number =1;
  @Input() dt: string = "2021-12-01T07:00";
  
  user : User; 
  pntInfo : any = {}; 

  pntValues : PointValue[] = [];
  pntValue : PointValue;
  pntPreviousValue : PointValue;
  calcValue : PointValue;
  dec: number = 2;   
  displayValue : string = "---";
  previousDisplayValue : string = "---";

  isDigitalObject : boolean = false;
  isCalculated : boolean = false;
  isBlocked : boolean = false;

  httpError: HttpErrorResponse = null;
  
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private formSaveSubscription: Subscription;
  private inpBlockSubscription: Subscription;

  constructor(private http: HttpClient, 
    private _authService : AuthenticationService, 
    private _formService : InputDataService) { 
  }
 
  ngOnInit() {
    this.user = this._authService.userValue;
    this.loadInfo();

    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      this.dt = isoDt; 
      if (this.isCalculated) this.loadCalcValue();
      this.loadDatabaseValue(); 
    });

    this.inpChangedSubscription = this._formService.inputChangeAsObservable.subscribe(payload=>{
      if (this.isCalculated){
        this.loadCalcValue();      
      }
    });

    //form Save... btn click
    this.formSaveSubscription = this._formService.calcSavedAsObservable.subscribe(payload =>{
      if (this.isCalculated){
        if (this.calcValue) this.postApi(this.calcValue.value);  
      } else {
        if (this.pntValue) this.postApi(this.pntValue.value);  
      }      
    });

    this.inpBlockSubscription = this._authService.input_lock.subscribe(payload => {
      this.isBlocked = payload;
    });

  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.formSaveSubscription.unsubscribe();
    this.inpBlockSubscription.unsubscribe();
  }

  //const cur  = JSON.stringify(chng.currentValue);
  //controls input changed !
  ngOnChanges(changes: SimpleChanges) {
    if (this.isCalculated) this.loadCalcValue();
    this.loadDatabaseValue(); 
  }

  //pntValues - array 0 - current value, 1- previous
  setDisplay() {    
      //распределить последнее - предпоследнее значение по ячейкам
      let current_ts = new SmartDate(this.dt);
      let previous_ts = new SmartDate(this.dt);
      //let granularity = this.pntInfo.granularity ? this.pntInfo.granularity : "days"; //TODO TODO  
      previous_ts = previous_ts.getPreviousTimeStamp("days"); 

      //find current value
      let curV = this.pntValues.find(v=> {
        let ts = new SmartDate(v.time_stamp);
        return current_ts.compareTo(ts);
      });

      //find previous value
      let preV = this.pntValues.find(v=> {
        let ts = new SmartDate(v.time_stamp);
        return previous_ts.compareTo(ts);
      });

      //set current value
      if (curV) {
        this.pntValue = curV;
      } else {
        this.pntValue = this.getNullValue();
      }

      //set previous value
      if (preV) {
        this.pntPreviousValue = preV;
      } else {
        this.pntPreviousValue = null;
      }

      //current display cell
      if (this.isCalculated) {
        if (this.isDigitalObject) {
          this.displayValue  = this.calcValue ? this.calcValue.state : "";
        } else {
          this.displayValue  = this.calcValue ? this.calcValue.value.toFixed(this.dec) : "0";  //TODO TODO
        }    
      } else {
        if (this.isDigitalObject) {
          this.displayValue  = this.pntValue ? this.pntValue.state : "";
        } else {
          this.displayValue  = this.pntValue ? this.pntValue.value.toFixed(this.dec) : "0";  //TODO TODO
        }    
      }

      //fill last value cell
      if (this.isDigitalObject) {
        this.previousDisplayValue  = this.pntPreviousValue ? this.pntPreviousValue.state : "";
      } else {
        this.previousDisplayValue  = this.pntPreviousValue ? this.pntPreviousValue.value.toFixed(this.dec) : "";  //TODO TODO
      }  

  }

  loadInfo() {
    this.getPointInfo(this.point).subscribe( pntInfo=>{
        //alert(JSON.stringify(...));
        this.pntInfo = pntInfo.data;
        this.isCalculated = this.pntInfo.func ? true : false; 
        this.dec = this.pntInfo.fixed ? this.pntInfo.fixed : 2;

        if (this.pntInfo.type == "select") {
          this.isDigitalObject = true;
        } else {
          this.isDigitalObject = false;
        }

        if (this.isCalculated) this.loadCalcValue();    
    });
  }

  loadDatabaseValue() {
    this.getPointValue(this.point, this.dt).subscribe( val=> {
      this.pntValues = val.data;
      this.httpError = null;
      this.setDisplay();
    },
      (error: HttpErrorResponse) => {
        this.httpError = error;
        this.pntValue = this.getNullValue();
        this.setDisplay();
      }
    );
  }

  getNullValue() {
    let newVal = { 
      value: 0, 
      time_stamp: this.dt, 
      point: this.point, 
      state: "Normal",
      user: this.user._id, 
    }; 
    return newVal;
  }
  
  loadCalcValue() {
    this.getCalcValue(this.pntInfo.func, this.dt).subscribe( val=> {
      this.calcValue = val.data;
      //console.log(val.data);
      this.httpError = null;
      this.setDisplay();
    },
      (error: HttpErrorResponse) => {
        this.httpError = error;
        //console.log(JSON.stringify(error));
        const newVal = { 
          value: 0, 
          time_stamp: this.dt, 
          point: this.point, 
          state: "Normal",
          user: this.user._id, 
        }; 
        this.calcValue = newVal;
        this.setDisplay();
      }
    );
  }

  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options`);
  }

  getPointValue(point:Number, dt: string) : Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/last-values?point=${point}&time_stamp[$lte]=${dt}&sort=-time_stamp&limit=2`);
  }

  getCalcValue(func_id:Number, dt: string) : Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/functions/${func_id}/calc?time_stamp=${dt}`);
  }

  postNewValue(value:any) : Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/values`, value);
  }
   
  //input changed event 
  valueChanged(e: any) {
    //console.log(e.target.value);
    
    //если параметр не расчетн - прямая запись в БД
    if (!this.isCalculated) {
      this.postApi(e.target.value);
    }
    
    this._formService.inputChanged(e.target.value);
  }

  postApi(value) {
    const kvp = this.pntInfo.options? this.pntInfo.options.kvp.find(kvp=>kvp.key==value) : null;
    const newState = kvp ? kvp.value : "Normal";
    const newVal = { 
      value: value, 
      time_stamp: this.dt, 
      point: this.point, 
      state: newState,
      user: this.user._id, 
    }; 
    this.postNewValue(newVal).subscribe(res=>{
      //alert(JSON.stringify(res));
      this.loadDatabaseValue();
    });
  }

}
