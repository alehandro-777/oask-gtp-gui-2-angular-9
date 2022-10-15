import { Component, OnInit, Input, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription  } from 'rxjs';
import { skip } from 'rxjs/operators';
import { environment } from 'src/environments/environment'
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';

@Component({
  selector: 'app-input-par-cell',
  templateUrl: './input-par-cell.component.html',
  styleUrls: ['./input-par-cell.component.css']
})
export class InputParCellComponent implements OnInit, OnDestroy {
  @Input() point: number =1;
  @Input() dt: string = "2021-12-01T07:00";
  @Input() width: string = "100px";
  @Input() init_values: any[];
  @Input() db_points: any[];

  pntValue : any;
  calcValue : any;

  user : User; 
  pntConfig : any = {}; 

  dec: number = 2;   
  displayValue : string = "---";

  isCalculated : boolean = false;
  isBlocked : boolean = false;
 
  httpError: HttpErrorResponse = null;
  
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private inpBlockSubscription: Subscription;

  constructor(private http: HttpClient, 
    private _authService : AuthenticationService, 
    private _formService : InputDataService) { 
  }
 
  ngOnInit() {
    this.user = this._authService.userValue;
       
    //1 -- on menu dt changed
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log("Menu Dt calendar changed ", isoDt)
      this.dt = isoDt; 
      //this.refreshValues();
      //this._authService.setUnsavedChanges(true); 
    }); 
    
    //2-- on form's input changed -> call function
    this.inpChangedSubscription = this._formService.inputChangeAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Input changed ", payload)

      //TODO -> calc if id in func params  !!!
      if (this.isCalculated && typeof(payload) == "number") {        
        this.loadFuncResult();      
      }
    });

    //4 -- on input block state changed
    this.inpBlockSubscription = this._authService.input_lock.pipe(skip(1)).subscribe(payload => {
      //console.log("Input block click ", payload);  
      this.isBlocked = payload;
    });
 

  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.inpBlockSubscription.unsubscribe();
  }

  //const cur  = JSON.stringify(chng.currentValue);
  //controls input changed !
  ngOnChanges(changes: SimpleChanges) {
    if (changes.db_points) this.loadPointConfig();
    if (changes.init_values) this.refreshValues();    
  }

  //html input change event binding
  valueChanged(e: any) {
    //console.log(e.target.value);    

    //прямая запись в БД ??? если параметр расчетн - ?
    const newVal = this.createValueObj(e.target.value);
    this.postNewValue(newVal).subscribe(res=>{     
      //console.log(res.data)
      this.pntValue = res.data;
    });
  
    this.updateValueInCache(e.target.value);
    this._formService.inputChanged(this.point);
    this._authService.setUnsavedChanges(true);
  }

  setDisplay() {

    if (this.calcValue) {
      this.displayValue  = this.calcValue ? this.calcValue.value.toFixed(this.dec) : "0";  //TODO TODO

    } else {
      this.displayValue  = this.pntValue ? this.pntValue.value.toFixed(this.dec) : "0";  //TODO TODO
    }

  }

  loadPointConfig() {   
    //console.log(this.db_points.length, this.point) 
    if (this.db_points) {
      let db_point = this.db_points.find(e => e._id == this.point);      
      if (db_point) {
        this.pntConfig = db_point;
        this.isCalculated = this.pntConfig.func ? true : false; 
        this.dec = this.pntConfig.fixed ? this.pntConfig.fixed : 2;  
      }
    }
  }
 
  refreshValues() {
    if (this.isCalculated) this.loadFuncResult();
    this.loadDatabaseValue(); 
  }
 
  loadDatabaseValue() {

    if (this.init_values) {
      let value = this.init_values.find(e => e.point == this.point);
      if (value) {
        this.pntValue = value;
      } else {
        let default_value = this.createValueObj(0);
        this.pntValue = null;
        this.init_values.push(default_value);  
      }
      this.setDisplay();
    }
  }
 
  //load function result, update value in cache
  loadFuncResult() {
    if (!this.pntConfig.func) return;

    this.getCalcValue(this.pntConfig.func._id, this.dt).subscribe( val=> {
      this.calcValue = val.data;
      this.updateValueInCache(this.calcValue.value);
      //console.log(val.data);
      this.httpError = null;
      this.setDisplay();
    },
      (error: HttpErrorResponse) => {
        this.httpError = error;
        this.calcValue = null;
        this.setDisplay();
      }
    );
  }

  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options func`);
  }

  getPointValue(point:Number, dt: string) : Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/last-values?point=${point}&time_stamp=${dt}`);
  }

  getCalcValue(func_id:Number, dt: string) : Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/functions/${func_id}/calc?time_stamp=${dt}`);
  }

  postNewValue(value:any) : Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/values`, value);
  }  
  
  createValueObj(value) {
    const kvp = this.pntConfig.options? this.pntConfig.options.kvp.find(kvp=>kvp.key==value) : null;
    const newState = kvp ? kvp.value : "Normal";
  
 
    const newVal = { 
      value: value, 
      time_stamp: this.dt, 
      point: this.point, 
      state: newState,
      user: this._authService.userValue._id, 
    };
    return newVal;
  }

  updateValueInCache(value) {
    let old_value = this.init_values.find(e => e.point == this.point);
    if (old_value) {
      old_value.value = value;
    } else {
      let new_value = this.createValueObj(value);
      this.init_values.push(new_value);         
    }
    //console.log(this.init_values)
  }
}
 