import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class TableHttpService {
  
  constructor(private http: HttpClient) { }

  getHttpData(form_id:string, page_index: number =0, per_page:number =0) : Observable<any> { 
    if (page_index==0) {
      return this.http.get<any>(`${environment.apiUrl}/formvalues/${form_id}`);
    }
    if (per_page==0) {
      return this.http.get<any>(`${environment.apiUrl}/formvalues/${form_id}?page=${page_index+1}`);  
    }
    return this.http.get<any>(`${environment.apiUrl}/formvalues/${form_id}?page=${page_index+1}&per_page=${per_page}`);
  }
}
