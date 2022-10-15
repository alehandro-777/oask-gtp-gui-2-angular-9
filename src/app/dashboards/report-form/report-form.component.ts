import { Component, Input, OnInit, ViewEncapsulation,OnDestroy,ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import {  Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/login/authentication.service';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InputDataService } from '../input-data-dashboard/input-data.service';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportFormComponent implements OnInit,OnDestroy {

  @Input() id=111;

  private sideMenuSubscription : Subscription;
  private dtSubscription: Subscription;
  private inpChangedSubscription: Subscription;
  private formSaveSubscription: Subscription;
  private inpBlockSubscription: Subscription;
  private updateSubscription: Subscription;
  private exportSubscription: Subscription;

  dt:string;
  
  //api data
  header: string ="";
  data:any[] = [];
  form:any = {};

  constructor(    
    private _authService : AuthenticationService, 
    private http: HttpClient,
    private _formService : InputDataService) { }

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
          this.loadData(this.id);
        }); 
        
        //3-- on form input changed
        this.inpChangedSubscription = this._formService.inputChangeAsObservable.pipe(skip(1)).subscribe(payload=>{
          //console.log("Input changed ", payload)
        });
    
        //4-- form Save... btn click
        this.formSaveSubscription = this._formService.calcSavedAsObservable.pipe(skip(1)).subscribe(payload =>{
          //console.log("Save btn Click ", payload) 
          this.saveAll();
        });
    
        //5 -- on input block state changed
        this.inpBlockSubscription = this._authService.input_lock.pipe(skip(1)).subscribe(payload => {
          //console.log("Input block click ", payload);  
        });
    
        //6-- menu update pressed
        this.updateSubscription = this._formService.updateClickAsObservable.pipe(skip(1)).subscribe(payload=>{
          //console.log("Load cliced");
          //console.log(this.form_values)
          this.loadData(this.id);
        });
        
        //7-- Export pressed
        this.exportSubscription = this._formService.exportClickAsObservable.pipe(skip(1)).subscribe(payload=>{
          //console.log("Excel cliced");
          this.saveExcel(this.id);
        });
  }
 
  ngOnDestroy() {
    this.sideMenuSubscription.unsubscribe();
    this.dtSubscription.unsubscribe();
    this.inpChangedSubscription.unsubscribe();
    this.formSaveSubscription.unsubscribe();
    this.inpBlockSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.exportSubscription.unsubscribe();  
  } 



  sideMenuItemChanged(payload) {
    this.id = payload.id;
    //console.log("Menu click ->", event); 
    this.loadHeader(payload.id);
    this.loadData(payload.id);
    this.loadForm(payload.id)
  }

  loadHeader(id:number) {
    this.getHeader(id).subscribe(html=> {
      //console.log(html);
      this.header = html;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.header = "";
      }
    );
  }

  loadData(id:number) {
    this.getRows(id).subscribe(resp=> {
      //console.log(resp.data);
      this.data = resp.data;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.data = [];
      }
    );
  }

  loadForm(id:number) {
    this.getFormConfig(id).subscribe(resp=> {
      //console.log(resp.data);
      this.form = resp.data;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.form = {};
      }
    );
  }


  saveExcel(id:Number) {
    this.getXlsx(id).subscribe( html => {
      saveAs(html.body, `${this.form.short_name}_${this.dt}.xlsx`);
    });    
  }

  saveAll() {
    const values =[];
    this.data.forEach(row => {
      row.forEach(col => {
        if (col.type == "input") {
          //if dbpoint has time stamp
          let ts = col.time_stamp ? col.time_stamp : this.dt; 
          let tmp = { "point": col.bind, "value": col.value, "time_stamp": ts};
          values.push(tmp);  
        }        
      });        
    });
      
    //console.log(values)
    this.saveFormValues(values).subscribe(res=>{ 
      //console.log(res)
      this.loadData(this.id);
     });
  }

  getRows(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/rows?begin=${this.dt}`);
  }
  
  getHeader(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/header1`, {responseType: 'text'});
  }

  getXlsx(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/forms/${id}/export?begin=${this.dt}`, {responseType:'blob' as 'json', observe: 'response'});
  }

  saveFormValues(values) : Observable<any> { 
    return this.http.post(`${environment.apiUrl}/forms/save`, values);
  }

  getFormConfig(id:Number) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/excel-reports/${id}`);
  }
}
