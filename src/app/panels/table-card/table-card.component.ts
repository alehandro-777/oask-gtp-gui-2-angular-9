import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderCellModel } from 'src/app/tables/complex-table/header-cell.model';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { Input } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Observable, Subscription } from 'rxjs';

import headCfg from '../table-card/head1.json'; 
 
@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css']
})
export class TableCardComponent implements OnInit, OnDestroy {

  @Input() id: Number =1;
  @Input() dt: string = "2021-12-01T07:00";

  title = 'Title';
  rows = [];
  header: HeaderCellModel[][];
  footer = {}
  formats = [];

  dtSubscription: Subscription;
  
  constructor(private http: HttpClient, private _authService : AuthenticationService) { 
    
  }

  ngOnInit() {
    this.formats = headCfg.pop();
    this.header =  headCfg;
    
    //this.loadValue();

    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log(JSON.stringify(s), this.user); 
      this.dt = isoDt; 
      this.loadValue();
    });
  }

  loadValue() {
    this.getTableData().subscribe( val=> {
      //alert(JSON.stringify(this.pntValue));
      //console.log(this.formats); 
      let rows = this.formatTable(val.data, this.formats);
      //console.log(rows); 

      this.footer = val.data.pop();
      this.rows = val.data; 
    },
      (error: HttpErrorResponse) => {
        if (error.status == 404) {
          
          
        };
      }
    );          
}

  formatTable(rows, formats) {
    return rows.map((row, i)=>{
      row["#"] = new Date(row["#"]).toLocaleString()
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call( row, key)) {
          const value = row[key];
          if (!value) continue;
          const format = formats.find(f=>f.key == key);
          if (format && format.text)  row[key] = value.toFixed( +format.text);
        }
      }
    })
  }

  getTableData() : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/tables?gasday=${this.dt}`);
  }

  ngOnDestroy() {
    this.dtSubscription.unsubscribe();
  } 
}
