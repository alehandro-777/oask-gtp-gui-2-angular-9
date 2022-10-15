import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Observable, Subscription } from 'rxjs';
import { SmartDate } from 'src/app/models/smart-date';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { InputBlock } from 'src/app/models/input-block.model';

@Component({
  selector: 'app-blocks-table',
  templateUrl: './blocks-table.component.html',
  styleUrls: ['./blocks-table.component.css']
})
export class BlocksTableComponent implements OnInit, OnDestroy {

  @Input() dt_begin: string ="2000-01-01";
  @Input() dt_end: string ="2000-01-02";

  dtSubscription: Subscription;

  data:[];

  constructor(private http: HttpClient, private _authService : AuthenticationService) { }

  ngOnInit() {
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //onsole.log("dt clicked");
      //console.log(JSON.stringify(s), this.user); 
      this.dt_begin =  new SmartDate(isoDt).firstMonthDay().dt.toISOString().substring(0,10);
      this.dt_end =  new SmartDate(isoDt).nextGasDay().dt.toISOString().substring(0,10);

      this.loadHttpData();
    });
    this.loadHttpData();
  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
  }
  
  loadHttpData() {
    this.getHttpData(this.dt_begin, this.dt_end).subscribe(res=> {
      //console.log(html);
      this.data = res.data;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.data = [];
      }
    );
  }

  endChanged(event) {
    //console.log(event.target.value)
    this.dt_end = event.target.value;
    this.loadHttpData();
  }

  startChanged(event) {
    //console.log(event.target.value)
    this.dt_begin = event.target.value;
    this.loadHttpData();
  }

  unLockClicked(item){
    console.log(item)
    
    const data = new InputBlock();
    data.active = false;
    data.user = this._authService.userValue._id;
    data.role = item.role._id;
    data.time_stamp = item.time_stamp;
    data.granularity = item.granularity;

    this.postNewValue(data).subscribe(res=> {
      this.loadHttpData();
    });
  }

  postNewValue(value:InputBlock) : Observable<InputBlock> { 
    return this.http.post<InputBlock>(`${environment.apiUrl}/input-blocks`, value);
  }

  getHttpData(begin: string, end:string) : Observable<any> { 
    return this.http.get(`${environment.apiUrl}/input-blocks-last?include=user role&time_stamp[$gte]=${begin}&time_stamp[$lt]=${end}&sort=time_stamp`);
  }
}
