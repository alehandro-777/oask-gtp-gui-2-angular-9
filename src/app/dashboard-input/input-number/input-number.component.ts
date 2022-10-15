import { Component, OnInit, Input, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription  } from 'rxjs';
import { skip } from 'rxjs/operators';
import { environment } from 'src/environments/environment'
import { AuthenticationService } from 'src/app/login/authentication.service';
import { User } from 'src/app/admin/user/user.model';
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css']
})
export class InputNumberComponent implements OnInit, OnDestroy {
  
  @Input() point: any = {};

  dt:string;

  isBlocked : boolean = false;
 
  httpError: HttpErrorResponse = null;
  
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private inpBlockSubscription: Subscription;
  private updateSubscription: Subscription;

  constructor(private http: HttpClient, 
    private _authService : AuthenticationService, 
    private _formService : InputDataService) { 

    }

  ngOnInit() {
      
    //1 -- on menu dt changed
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log("Menu Dt calendar changed ", isoDt)
      this.dt = isoDt; 
      this.loadFuncResult();
    }); 
    
    //2-- on form's input changed -> call function
    this.inpChangedSubscription = this._formService.inputChangeAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Input changed ", payload)

    });

    //4 -- on input block state changed
    this.inpBlockSubscription = this._authService.input_lock.pipe(skip(1)).subscribe(payload => {
      //console.log("Input block click ", payload);  
      this.isBlocked = payload;
    });

    //6-- menu update pressed
    this.updateSubscription = this._formService.updateClickAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Load cliced");
      //console.log(this.form_values)
    });

    //this.loadFuncResult();
  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.inpBlockSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  //const cur  = JSON.stringify(chng.currentValue);
  //controls input changed !
  ngOnChanges(changes: SimpleChanges) {
    //if (changes.db_points) this.loadPointConfig();
  }

  //html input change event binding
  valueChanged(e: any) {
    let new_val = e.target.value
    //console.log(new_val);
    if (new_val != "") {
      let dec = this.point.fixed ? this.point.fixed : 2;
      this.point.value = Number(new_val).toFixed(dec);
      this._formService.inputChanged(this.point);  
    }
  }

  //load function result, update value in cache
  loadFuncResult() {
    //if point has formula
    //console.log(this.point)
    if (typeof this.point.func !== 'undefined') {
      this.getCalcValue(this.point.func, this.point.time_stamp).subscribe( res=> {
        //console.log(res.data);
        if (typeof this.point.fixed !== 'undefined') {
          this.point.value  = res.data.value.toFixed(this.point.fixed);
        } else {
          this.point.value  = res.data.value.toFixed(2);
        } 
        //this.point.value  = res.data.value;
        this.httpError = null;
      },
        (error: HttpErrorResponse) => {
          this.httpError = error;
        }
      );

    }
    
  }

  getCalcValue(func_id:string, dt: string) : Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/functions/${func_id}/calc?time_stamp=${dt}`);
  }
}
