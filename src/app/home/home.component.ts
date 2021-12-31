import { Component, OnInit } from '@angular/core';
import {environment} from 'src/environments/environment'
import { TreeMenuNode } from '../tree-menu/tree-menu-node.model';
import { HeaderModel } from '../tables/table-model';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
}) 
 
export class HomeComponent implements OnInit {
  side_menu: TreeMenuNode[];

  //test table 1
  header: HeaderModel[]; 
  rows: any[];
  point = 1;
  length = 100;
  pageSize = 24;
  pageIndex=0;
  title: String;
  selectedRow :any={};

  gasday: string = new Date().toISOString().split("Z")[0];

  constructor(public dialog: MatDialog, private http: HttpClient) { 
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
    this.fillTestSideMenu();
    this.fillTestTable1();
    this.update();
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

  fillTestSideMenu(){
    this.side_menu = [
      {
        icon:"mic",
        name:"Об'екти", 
        childNodes:[
          {icon:"wallpaper",name:"Point 1",  payload:{"id":1}}, 
          {icon:"mic",name:"Point 2",  payload:{"id":2}}, 
          {icon:"mic",name:"Point 3",  payload:{"id":3}}, 
          {icon:"mic",name:"Point 4",  payload:{"id":4}} ,
          {icon:"mic",name:"Point 5", payload:{"id":5}},
          {icon:"wallpaper",name:"Point 6", payload:{"id":6}},    
          {icon:"wallpaper",name:"Мрин стан",  payload:{"id":83}}, 
          {icon:"mic",name:"Point 7",  payload:{"id":7}}, 
          {icon:"mic",name:"Point 8",  payload:{"id":8}}, 
          {icon:"mic",name:"Point 9",  payload:{"id":9}} ,
          {icon:"mic",name:"Point 10", payload:{"id":10}},
          {icon:"wallpaper",name:"Point 11", payload:{"id":11}},    
          {icon:"wallpaper",name:"Point 12",  payload:{"id":12}}, 
          {icon:"mic",name:"Point 9",  payload:{"id":9}}, 
          {icon:"mic",name:"Point 10",  payload:{"id":10}}, 
          {icon:"mic",name:"Point 11",  payload:{"id":11}} ,
          {icon:"mic",name:"Point 127", payload:{"id":127}},
          {icon:"wallpaper",name:"Point 128", payload:{"id":128}},    
          {icon:"wallpaper",name:"Point 129",  payload:{"id":129}}, 
          {icon:"mic",name:"Point 94",  payload:{"id":94}}, 
          {icon:"mic",name:"Point 105",  payload:{"id":105}} 
        ],
        payload:{"id":1}
      }, 
      {icon:"settings_system_daydream", name:"Звіти", payload:{"id":20}} ];

  }

}
