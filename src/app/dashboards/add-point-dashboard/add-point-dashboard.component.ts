import { Component, OnInit, OnDestroy } from '@angular/core';
import {environment} from 'src/environments/environment'
import { DbPointCfg } from 'src/app/forms/db-point-model';
import { HeaderModel } from 'src/app/tables/table-model';
import { HttpClient } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { InputDataService } from '../input-data-dashboard/input-data.service';
import { PointValue } from 'src/app/forms/point-value-model';
import { InputCfg } from 'src/app/forms/input-cfg-model';
import { DynamicDialogFormComponent } from 'src/app/forms/dynamic-dialog-form/dynamic-dialog-form.component';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-add-point-dashboard',
  templateUrl: './add-point-dashboard.component.html',
  styleUrls: ['./add-point-dashboard.component.css']
})
export class AddPointDashboardComponent implements OnInit, OnDestroy {
  //test table 1
  header: HeaderModel[]; 
  rows: any[];
  point = 1;
  length = 100;
  pageSize = 24;
  pageIndex=0;
  title: String;
  selectedRow :any={};
  pointInfo:any={};

  sideMenuSubscription : Subscription;
  addNewCmdSubscription : Subscription;
  dtSubscription : Subscription;

  gasday: string = new Date().toISOString().split("Z")[0];

  constructor(public dialog: MatDialog, private http: HttpClient, 
    private _authService : AuthenticationService,
    private _inputDataService : InputDataService) { }

    ngOnInit() {

      this.fillColumnNames();
      this.update();

      this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
        //onsole.log("dt clicked");
        //console.log(JSON.stringify(s), this.user); 
        this.gasday = isoDt;
      });
      
      this.sideMenuSubscription = this._authService.side_menu.subscribe(payload=>{
        //console.log(JSON.stringify(s), this.user); 
        this.pointChanged(payload);
        this.point = payload.id;
      });
  
      this.addNewCmdSubscription = this._inputDataService.addClickAsObservable.pipe(skip(1)).subscribe(payload=>{
        this.showDialog();
      });
    }

    ngOnDestroy() {
      this.sideMenuSubscription.unsubscribe();
      this.addNewCmdSubscription.unsubscribe();
      this.dtSubscription.unsubscribe();
    }
  

  pointChanged(event) {
    //alert(JSON.stringify(event));
    this.point  = event.id;
    this.pageIndex = 0;
    this.length = 0;
    //this.title = `Point # ${this.point}`;
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
    this.getPointInfo(this.point).subscribe(res=>{
      this.pointInfo = res.data;
      this.title = `${this.pointInfo.full_name} [${this.pointInfo._id}]`;
    });

    this.getHttpData(this.point, this.pageSize, this.pageIndex*this.pageSize ).subscribe(resp=> {
      this.length = resp.total;
      //this.pageSize = resp.limit;      
      this.rows = resp.data.map(row=>{
        return {...row, 
              time_stamp: new Date(row.time_stamp).toLocaleString(), 
              updated_at: new Date(row.updated_at).toLocaleString()}
      });
    }); 
  }

  getHttpData(point:Number, limit:Number, skip:Number=0) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/last-values?point=${point}&skip=${skip}&limit=${limit}&sort=-time_stamp`);
  }

  fillColumnNames() {
    this.header = [
      {id:"time_stamp","text":"Дата/час"}, 
      {id:"value","text":"Значення"},
      {id:"state","text":"Стан"},
      {id:"updated_at","text":"Оновлено"},
      ];

  }

  //------------------------
  showDialog() {
    this.getPointInfo(this.point).subscribe( pntInfo=>{
        //alert(JSON.stringify(res));point.data.options
        this.getPointValue(this.point, this.gasday).subscribe( val=> {
          const inp = this.createControls(this.gasday, pntInfo.data, val.data[0]);
          this.openDialog(pntInfo.data, inp);          
        });      
      });
  }
 
  openDialog(point:DbPointCfg, inputs: InputCfg[]){
    let dialogRef = this.dialog.open(DynamicDialogFormComponent, {
      disableClose : true,
      autoFocus : true,
      data: { 
        //title: title, 
        inputs: inputs
      },
    });
    
    dialogRef.afterClosed().subscribe(res => {
      //console.log(`Dialog result: ${result}`);
      //alert(JSON.stringify(res));
      if (!res) return;

      const kvp = point.options? point.options.kvp.find(kvp=>kvp.key==res.value) : null;
      const newState = kvp ? kvp.value : "Normal";
      const newVal = { 
        value: res.value, 
        time_stamp: res.date+"T"+res.time, 
        point: point._id, 
        state: newState,
        user: 6 
      }; 
      this.postNewValue(newVal).subscribe(res=>{
        //alert(JSON.stringify(res));
        this.update();
      });
    });
 }

  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options`);
  }

  getPointValue(point:Number, gasday: string) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/last-values?point=${point}&time_stamp[$lte]=${gasday}&sort=-created_at&limit=1`);
  }
 
  postNewValue(value:any) : Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/values`, value);
  }

  createControls(gasday:string, pointCfg:DbPointCfg,  current:PointValue): InputCfg[] {
    //alert(JSON.stringify(current));
    return [
      {
        "id": "date",
        "name": "date",
        "label": "Дата",
        "value": gasday.split("T")[0],
        "type": "date",
        "min": "0",
        "max": "3",
        "step": "1",
        "options": []
      },
      { 
        "id": "time",
        "name": "time",
        "label": "Час",
        "value": gasday.split("T")[1].split(".")[0],
        "type": "time",
      },
      {
        "id": "value",
        "name": "value",
        "label": pointCfg.name,
        "value": `${current ? current.value : ""}`,
        "type": pointCfg.type,
        "min": pointCfg.min,
        "max": pointCfg.max,
        "step": pointCfg.step,
        "options": pointCfg.options? pointCfg.options.kvp : []
      },  
    ];
  } 
}
