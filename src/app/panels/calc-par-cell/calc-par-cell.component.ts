import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment'
import { PointValue } from 'src/app/forms/point-value-model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';

@Component({
  selector: 'app-calc-par-cell',
  templateUrl: './calc-par-cell.component.html',
  styleUrls: ['./calc-par-cell.component.css']
})
export class CalcParCellComponent implements OnInit, OnDestroy {
  @Input() func_id: number =1;
  @Input() dt: string = "2021-12-01T07:00";
  @Input() width: string = "100px";
  @Input() init_values: any[];

  user : User; 

  calcValue : PointValue;
  dec: number = 2;   
  displayValue : string = "---";

  httpError: HttpErrorResponse = null;
   
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private formSaveSubscription: Subscription;

  constructor(private http: HttpClient, 
    private _authService : AuthenticationService, 
    private _formService : InputDataService) { 
  }
 
  ngOnInit() {

    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      this.dt = isoDt; 
      this.loadCalcValue();
    });

    this.inpChangedSubscription = this._formService.inputChangeAsObservable.subscribe(payload=>{
      this.loadCalcValue();      
    });

    //3-- form Save... btn click
    this.formSaveSubscription = this._formService.calcSavedAsObservable.subscribe(payload =>{
      //console.log("Save btn Click ", payload)  
      this.loadCalcValue();     
      });

  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.formSaveSubscription.unsubscribe();
  }

  //const cur  = JSON.stringify(chng.currentValue);
  //controls input changed !
  ngOnChanges(changes: SimpleChanges) {
    if (changes.init_values) this.loadCalcValue();
  }

  //pntValues - array 0 - current value, 1- previous
  setDisplay() {    
    this.displayValue  = this.calcValue ? this.calcValue.value.toFixed(this.dec) : "0";  //TODO TODO  }
  }
  
  loadCalcValue() {
    if (this.init_values) {
      let value = this.init_values.find(e => e.func == this.func_id);
      this.calcValue = value ? value : null;      
      this.setDisplay();
    }
  }

  getCalcValue(func_id:Number, dt: string) : Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/functions/${func_id}/calc?time_stamp=${dt}`);
  }

}

