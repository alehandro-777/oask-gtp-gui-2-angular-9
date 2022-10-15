import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment'
import { PointValue } from 'src/app/forms/point-value-model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';


@Component({
  selector: 'app-readonly-par-cell',
  templateUrl: './readonly-par-cell.component.html',
  styleUrls: ['./readonly-par-cell.component.css']
})
export class ReadonlyParCellComponent implements OnInit, OnDestroy {

  @Input() point: number =1;
  @Input() dt: string = "2021-12-01T07:00";
  @Input() width: string = "100px";
  @Input() type: string = "last-values";

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
    this.user = this._authService.userValue;

    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      this.dt = isoDt; 
      this.loadCalcValue();
    });

    this.inpChangedSubscription = this._formService.inputChangeAsObservable.subscribe(payload=>{
      this.loadCalcValue();      
    });

    //3-- form Save... btn click
    this.formSaveSubscription = this._formService.calcSavedAsObservable.subscribe(payload =>{
      console.log("Save btn Click ", payload)  
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
    this.loadCalcValue();
  }

  //pntValues - array 0 - current value, 1- previous
  setDisplay() {    
    this.displayValue  = this.calcValue ? this.calcValue.value.toFixed(this.dec) : "0";  //TODO TODO  }
  }
  
  loadCalcValue() {
    this.getValue(this.dt).subscribe( val=> {
      this.calcValue = val.data.length == 0 ? "---" : val.data[0];
      //console.log(val.data);
      this.httpError = null;
      this.setDisplay();
    },
      (error: HttpErrorResponse) => {
        this.httpError = error;
        //console.log(JSON.stringify(error));
        this.setDisplay();
      }
    );
  }

  getValue(dt: string) : Observable<any> {
      return this.http.get<any>(`${environment.apiUrl}/${this.type}?point=${this.point}&time_stamp=${dt}`);
  }

}
