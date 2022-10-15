import { Component, OnInit,OnDestroy } from '@angular/core';
import { TreeMenuNode } from 'src/app/tree-menu/tree-menu-node.model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import menuCfg from './buttons-menu.json';
import { Observable, Subscription } from 'rxjs';
import { SmartDate } from 'src/app/models/smart-date';

@Component({
  selector: 'app-table-dashboard',
  templateUrl: './table-dashboard.component.html',
  styleUrls: ['./table-dashboard.component.css']
})
export class TableDashboardComponent implements OnInit, OnDestroy {
  sideMenuSubscription : Subscription;

  id =1;
  dt: string = "2000-01-01T07:00";
  dt_begin: string = "2000-01-01";
  dt_end: string = "2000-01-02";
  dtSubscription: Subscription;

  constructor(private _authService : AuthenticationService) { }

  ngOnInit() {
    this.sideMenuSubscription = this._authService.side_menu.subscribe(payload=>{
      this.pointChanged(payload);
    });

    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //onsole.log("dt clicked");
      //console.log(JSON.stringify(s), this.user); 
      this.dt_begin =  new SmartDate(isoDt).currGasDay().dt.toISOString().substring(0,10);
      this.dt_end =  new SmartDate(isoDt).nextGasDay().dt.toISOString().substring(0,10);
      this.dt = isoDt;
    });
  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
    this.sideMenuSubscription.unsubscribe();
  }

  pointChanged(event) {
    //console.log(id); 
    this.id = event.id;
  }
  
  endChanged(event) {
    //console.log(event.target.value)
    this.dt_end = event.target.value;
  }

  startChanged(event) {
    //console.log(event.target.value)
    this.dt = event.target.value;
  }

}
