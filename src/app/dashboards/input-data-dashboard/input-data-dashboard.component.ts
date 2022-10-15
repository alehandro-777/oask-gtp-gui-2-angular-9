import { Component, Input, OnInit, ViewEncapsulation,OnDestroy,ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { TreeMenuNode } from '../../tree-menu/tree-menu-node.model';
import {  Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/login/authentication.service';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InputDataService } from './input-data.service';

@Component({
  selector: 'app-input-data-dashboard',
  templateUrl: './input-data-dashboard.component.html',
  styleUrls: ['./input-data-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InputDataDashboardComponent implements OnInit,OnDestroy  {

  @Input() form_id=1;

  side_menu: TreeMenuNode[];

  gasday = "2021-12-01";
  gastime = "07:00";

  dt:string;

  header: string ="";
  title: string="";
  table : any;
  form_values : any;
  form_points : any;

  private sideMenuSubscription : Subscription;
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private formSaveSubscription: Subscription;
  private inpBlockSubscription: Subscription;
  private updateSubscription: Subscription;

  constructor(
    private _authService : AuthenticationService, 
    private http: HttpClient,
    private _formService : InputDataService
    ) { }

  ngOnInit() {

    //1- side menu item changed
    this.sideMenuSubscription = this._authService.side_menu.subscribe(payload=>{
      //console.log(JSON.stringify(s), this.user); 
      this.sideMenuItemChanged(payload);
    });

    //2 -- on menu dt changed
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log("Menu Dt calendar changed ", isoDt)
      this.dt = isoDt;
      this.loadFormValues(this.form_id);  
    }); 
    
    //3-- on form input changed
    this.inpChangedSubscription = this._formService.inputChangeAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Input changed ", payload)
    });

    //4-- form Save... btn click
    this.formSaveSubscription = this._formService.calcSavedAsObservable.pipe(skip(1)).subscribe(payload =>{
      //console.log("Save btn Click ", payload) 
      this.saveAll(); 
      this._authService.setUnsavedChanges(false);
    });

    //5 -- on input block state changed
    this.inpBlockSubscription = this._authService.input_lock.pipe(skip(1)).subscribe(payload => {
      //console.log("Input block click ", payload);  
    });

    //6-- menu update pressed
    this.updateSubscription = this._formService.updateClickAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Load cliced");
      //console.log(this.form_values)
      this.loadFormValues(this.form_id);  
    }); 
 
  }

  ngOnDestroy() {
    this.sideMenuSubscription.unsubscribe();
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.formSaveSubscription.unsubscribe();
    this.inpBlockSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();  
  } 

 
  DateChanged(e){
    this.gasday = e.target.value;
    this.dt = this.gasday +"T"+this.gastime;
  }

  TimeChanged(e){
    this.gastime = e.target.value;
    this.dt = this.gasday +"T"+this.gastime;
  }

  getHtmlTableHeader(id:number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/header`, {responseType: 'text'});
  }
  
  getFormConfig(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}`);
  }

  getFormInitValues(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/init?time_stamp=${this.dt}`);
  }

  saveFormValues(id:Number, values) : Observable<any> { 
    return this.http.post(`${environment.apiUrl}/forms/${id}/save?time_stamp=${this.dt}`, values);
  }
 
  getFormDbPointsConfig(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/points`);
  }
  loadHeader(id:number) {
    this.getHtmlTableHeader(id).subscribe(html=> {
      //console.log(html);
      this.header = html;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.header = "";
      }
    );
  }
  loadFormConfig(id : number) {
    this.getFormConfig(id).subscribe(res=> {
      //console.log(html);
      this.table = res.data;
      this.title = `${res.data.title}`;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.title = error.statusText;
        this.header = "";
        this.table = {
          columns:[],
          rows:[]
        };
      }
    );
  }
  loadFormValues(id : number) {
    this.getFormInitValues(id).subscribe(res=> {      
      this.form_values = res.data;
      //console.log(res.data.length);
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.title = error.statusText;
        this.form_values = [];
      }
    );
  }
  loadFormPointsConfig(id : number) {
    this.getFormDbPointsConfig(id).subscribe(res=> {      
      this.form_points = res.data;
      //console.log(res.data.length);
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.title = error.statusText;
        this.form_points = [];
      }
    );
  }
  sideMenuItemChanged(payload) {
    this.form_id = payload.id;
    //console.log("Menu click ->", event); 
    this.loadHeader(payload.id);
    this.loadFormConfig(payload.id);

    this.loadFormPointsConfig(payload.id);
    this.loadFormValues(payload.id); 
  }
  
  saveAll() {
    let values = this.form_values.map(v=> {
      if (v.point) {
        let {_id, created_at, ...res} = v;
        return res;
      }
    });
    values = values.filter(e=>e);
    //console.log(values)
    this.saveFormValues(this.form_id, values).subscribe(res=>{  
      this.loadFormValues(this.form_id);
    });
  }
}
