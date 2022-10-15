import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/login/authentication.service';
import { environment } from 'src/environments/environment'
import { saveAs } from 'file-saver'
import { InputDataService } from 'src/app/dashboards/input-data-dashboard/input-data.service';

@Component({
  selector: 'app-table-html-card',
  templateUrl: './table-html-card.component.html',
  styleUrls: ['./table-html-card.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TableHtmlCardComponent implements OnInit, OnDestroy {

  @Input() id: Number =1;
  @Input() dt: string = "2000-01-01T07:00";
  @Input() dt_end: string = "2000-01-02T07:00";


  exportSubscription: Subscription;
  updateSubscription: Subscription;

  tableHtml: string;
  reportCfg : any;
  tableTitle : string ="";

  constructor(private http: HttpClient, 
    private _formService : InputDataService
    ) { }

  ngOnInit() {

    this.exportSubscription = this._formService.exportClickAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Excel cliced");
      this.saveExcel();
    });

    this.updateSubscription = this._formService.updateClickAsObservable.pipe(skip(1)).subscribe(payload=>{
      //console.log("Load cliced");
      this.loadValue();
    }); 
  }

  ngOnDestroy() {
    this.exportSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadConfig();
    this.loadValue();
  }
  
  loadValue() {
    this.getTableData().subscribe( html => {
      //alert(JSON.stringify(this.pntValue));
      //console.log(html); 
      this.tableHtml = html;
    },
      (error: HttpErrorResponse) => {
        //console.log(error);
        this.tableHtml = "";
      }
    );          
  }

  loadConfig() {
    this.getTableConfig().subscribe( res => {
      this.reportCfg = res.data;
      this.tableTitle = this.reportCfg.full_name;
    },
      (error: HttpErrorResponse) => {
        this.tableHtml = "";
        this.tableTitle = "";
      }
    );          
  }

  saveExcel() {
    this.getExcel().subscribe( html => {
      saveAs(html.body, `${this.reportCfg.short_name}_${this.dt}.xlsx`);
    });    
  }

  getTableConfig(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/excel-reports/${this.id}`);
  } 
  
  getTableData() : Observable<any> {  
    let dt_parts = this.dt.split('T');
    return this.http.get(`${environment.apiUrl}/html?begin=${this.dt}&end=${this.dt_end}T${dt_parts[1]}&id=${this.id}`, {responseType: 'text'});
  }
  getExcel() : Observable<any> {  
    let dt_parts = this.dt.split('T');
    return this.http.get(`${environment.apiUrl}/excel?end=${this.dt_end}T${dt_parts[1]}&begin=${this.dt}&id=${this.id}`, {responseType:'blob' as 'json', observe: 'response'});
  }
}
