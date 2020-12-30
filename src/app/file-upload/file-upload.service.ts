import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient
  ) { }

  upload(formData){
    return this.http.post<any>(`${environment.apiUrl}/image`, formData, {  
      reportProgress: true,  
      observe: 'events'  
    }); 
  }
}
