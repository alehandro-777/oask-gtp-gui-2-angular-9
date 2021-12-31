import { Component, OnInit } from '@angular/core';
import { TreeMenuNode } from '../../tree-menu/tree-menu-node.model';

import menuCfg from './dash-config.json'; 

@Component({
  selector: 'app-input-data-dashboard',
  templateUrl: './input-data-dashboard.component.html',
  styleUrls: ['./input-data-dashboard.component.css']
})
export class InputDataDashboardComponent implements OnInit {

  side_menu: TreeMenuNode[];

  gasday = "2021-12-01";
  gastime = "07:00";

  dt:string;

  points:number[] = [];

  constructor() { }

  ngOnInit() {
    this.dt = this.gasday +"T"+this.gastime;
    this.side_menu = menuCfg;
  }
  
  DateChanged(e){
    this.gasday = e.target.value;
    this.dt = this.gasday +"T"+this.gastime;
  }

  TimeChanged(e){
    this.gastime = e.target.value;
    this.dt = this.gasday +"T"+this.gastime;
  }
  pointChanged(event){
    //console.log("Menu click ->", event); 

    //TEST TEST Mryn WITHDRAW
    switch (event.id) {
      case 7:
        this.points = [7, 129, 128, 94];
        break;
      case 8:
          this.points = [7, 129, 128, 105];
        break;
      
      default:
        break;
    }
  }
}
