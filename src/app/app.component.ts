import { Component, OnInit,OnDestroy } from '@angular/core';
import {FormService} from './forms/form.service'
import {AuthenticationService} from './login/authentication.service'
import { Observable,interval } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { TreeMenuNode } from './tree-menu/tree-menu-node.model';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import {InputBlock} from './models/input-block.model'
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';
import { SmartDate } from './models/smart-date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {

  side_menu: TreeMenuNode[];

  user$ : Observable<any>;
  currentDt : string="";

  gasday:string = "2022-01-01";
  gastime:string = "07:00";

  gasdt:string = "2021-12-01T07:00";

  isInputBlocked: boolean = false;

  timerObservable: Observable<number>;

  constructor(
    private http: HttpClient,
    private _authService : AuthenticationService,
    private _formService : FormService,
    private _inputDataService : InputDataService,
    private route: ActivatedRoute,
    private router: Router, 
    ) {

    }

  ngOnInit() {
    this.gasday = new Date().toISOString().split('T')[0];
    this.gasdt = this.gasday +"T"+this.gastime;

    this.user$ = this._authService.user;
    this._authService.changeTime(this.gasdt);
   
    
    //1 sec timer event
    this.timerObservable = interval(1000).pipe();

    this.timerObservable.subscribe((val) => 
    { 
      let dt = new Date();
      this.currentDt = `${dt.toLocaleString("ua-UA", 
      {
        hour:"numeric",
        minute:"numeric",
        second:"numeric",
        weekday:"short", 
        day:"numeric", 
        month:"2-digit",
        year:"numeric",
      })}`;
    }); 
      
    //user changed event
    this.user$.subscribe(user=>{
      this.loadSideMenu();
      this.updateCurrentInputBlockState();
    });

  } 
  
  ngOnDestroy() {
  }

  DateChanged(e){
    this.gasday = e.target.value;
    this.gastime = "07:00";
    this.gasdt = this.gasday +"T"+this.gastime;
    this._authService.changeTime(this.gasdt);
    this.updateCurrentInputBlockState();
  }

  TimeChanged(e) {
    //console.log(e.target.value) 
    this.gastime = e.target.value;
    this.gasdt = this.gasday +"T"+this.gastime;

    this._authService.changeTime(this.gasdt);
    this.updateCurrentInputBlockState();
  }

  logout(){
    this._authService.logout(); 
    this.side_menu = [];
  }

  loadSideMenu() {
    if (!this._authService.userValue) {
      this.side_menu = [];
      return;
    }

    let user_profile_id = this._authService.userValue.profile;

    this.getUserProfile(user_profile_id).subscribe(res=> {      
        this.side_menu = res.data.side_menu;
      }, (error: HttpErrorResponse) =>{
        this.side_menu = [];
      }
    );
 
  }

  pointChanged(e) {
    if (this._authService.hasChanges) {
      if (confirm("Зберегти зміни ?")) {
        this._inputDataService.calcSaved(this.gasdt);   
      }
    } else {}
         
    this.router.navigate([`/${e.component}` ]);
    this._authService.clickSideMenu(e); 
  }

  updateCurrentInputBlockState() {

    if (!this._authService.userValue) {
      this.isInputBlocked = true;
      return;
    }

    this.getBlockState().subscribe(res => {

      if (res.data.length==0) {
        //is UN locked
        this.isInputBlocked = false;
      }        
      else {
        //input locked now
        let block = res.data[0];
        this.isInputBlocked = block.active;
      }

      this._authService.changeInputLock(this.isInputBlocked);

    });
  }
  unlockDataInput() {
    const data = new InputBlock();
    data.time_stamp = this.gasday;
    data.active = false;
    data.user = this._authService.userValue._id;
    data.role = this._authService.userValue.role;
    this.postNewValue(data).subscribe(res=> {
      this.isInputBlocked = false;
      this._authService.changeInputLock(false);
    });
  }

  lockDataInput() {
    const data = new InputBlock();
    data.time_stamp = this.gasday;
    data.user = this._authService.userValue._id;
    data.role = this._authService.userValue.role;
    this.postNewValue(data).subscribe(res=> {
      this.isInputBlocked = true;
      this._authService.changeInputLock(true);
    });
  }

  postNewValue(value:InputBlock) : Observable<InputBlock> { 
    return this.http.post<InputBlock>(`${environment.apiUrl}/input-blocks`, value);
  }

  getBlockState() : Observable<any> {
    let role = this._authService.userValue.role;
    return this.http.get<any>(`${environment.apiUrl}/input-blocks-last?time_stamp=${this.gasday}&role=${role}`);
  }

  getUserProfile(id: string) : Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/profiles/${id}`);
  }

  saveClicked() {
    this._inputDataService.calcSaved(this.gasdt);
  }
  
  updateClicked() {
    this._inputDataService.updateClicked(this.gasdt);
  }

  excelClicked() {    
    this._inputDataService.exportClicked(this.gasdt);
  }

  addClicked() {    
    this._inputDataService.addClicked(this.gasdt);
  }
}

