import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/login/authentication.service';
import { environment } from 'src/environments/environment'
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-table-html-card',
  templateUrl: './table-html-card.component.html',
  styleUrls: ['./table-html-card.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TableHtmlCardComponent implements OnInit {

  @Input() id: Number =1;
  @Input() dt: string = "2021-12-02T07:00";
  dtSubscription: Subscription;
  title = 'Title';

  tableHtml: string;

  constructor(private http: HttpClient, private _authService : AuthenticationService) { }

  ngOnInit() {
    this.dtSubscription = this._authService.dt.subscribe(isoDt=>{
      //console.log(JSON.stringify(s), this.user); 
      this.dt = isoDt; 
      this.loadValue();
    });
  }

  loadValue() {
    this.getTableData().subscribe( html => {
      //alert(JSON.stringify(this.pntValue));
      console.log(html); 
      this.tableHtml = html;
    },
      (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 404) {
          
          
        };
      }
    );          
  }

  saveExcel() {
    this.getExcel().subscribe( html => {
      saveAs(html.body, "fuckkkkkk");
    });    
  }

  getTableData() : Observable<any> {  
    return this.http.get(`${environment.apiUrl}/html?gasday=${this.dt}`, {responseType: 'text'});
  }
  getExcel() : Observable<any> {  
    return this.http.get(`${environment.apiUrl}/excel?gasday=${this.dt}`, {responseType:'blob' as 'json', observe: 'response'});
  }
}
