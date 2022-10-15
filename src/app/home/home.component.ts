import { Component, OnInit } from '@angular/core';
import {environment} from 'src/environments/environment'

import { HeaderModel } from '../tables/table-model';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/login/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
}) 
 
export class HomeComponent implements OnInit {


  //test table 1
  header: HeaderModel[]; 
  rows: any[];
  point = 1;
  length = 100;
  pageSize = 24;
  pageIndex=0;
  title: String;
  selectedRow :any={};
  sideMenuSubscription : Subscription;

  gasday: string = new Date().toISOString().split("Z")[0];

  constructor(public dialog: MatDialog, 
    private http: HttpClient, 
    private _authService : AuthenticationService) { 
  }
 
  pointChanged(event) {
    //alert(JSON.stringify(event));
    this.point  = event.id;
    this.pageIndex = 0;
    this.length = 0;
    this.title = `Table #${this.point}`;
    this.update(); 
  }
  
  pageChanged(event) {
    //alert(JSON.stringify(event));
    this.pageIndex = event.pageIndex;    
    this.update(); 
  }

  rowSelected(row) {
    //alert(JSON.stringify(row));
    this.selectedRow = row;
  }

  valueAdded(event) {
    //alert(JSON.stringify(event));
    this.update();
  }
  update() {
    this.getHttpData(this.point, this.pageSize, this.pageIndex*this.pageSize ).subscribe(resp=> {
      this.length = resp.total;
      //this.pageSize = resp.limit;      
      this.rows = resp.data.map(row=>{
        return {...row, 
              time_stamp: new Date(row.time_stamp).toLocaleString(), 
              created_at: new Date(row.created_at).toLocaleString()}
      });
    });
  }
  ngOnInit() {

    this.fillTestTable1();
    this.update();
    this.sideMenuSubscription = this._authService.side_menu.subscribe(payload=>{
      //console.log(JSON.stringify(s), this.user); 
      this.pointChanged(payload);
    });

  }
  ngOnDestroy() {
    this.sideMenuSubscription.unsubscribe();
  }
  getHttpData(point:Number, limit:Number, skip:Number=0) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/values?point=${point}&skip=${skip}&limit=${limit}&sort=-time_stamp`);
  }
  fillTestTable1(){
    this.header = [
      {id:"time_stamp","text":"Дата/время"}, 
      {id:"value","text":"Значение"},
      {id:"state","text":"Состояние"},
      {id:"deleted","text":"Удалено"},
      {id:"created_at","text":"Создано"},
      ];

  }



}
