import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { buffer } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegimService {

  constructor(private http: HttpClient) { }

  getHttpData(report_id:string, day:string) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl2}/reports/regim/${report_id}?start=${day}`);  
  }
  getHttpExcel(report_id:string, day:string) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl2}/reports/excel/${report_id}?start=${day}`, {responseType:'blob' as 'json', observe: 'response'});  
  }
}
