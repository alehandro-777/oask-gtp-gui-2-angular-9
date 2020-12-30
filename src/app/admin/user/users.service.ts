import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { from, Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User, UpdateDeleteModel, UsersPage } from '../user/user.model'
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient

  ) { }

  createUser(new_model : User) : Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/users`, new_model);
  } 

  updateUser(new_model : User) : Observable<UpdateDeleteModel> {
    const id = new_model._id;
    return this.http.put<any>(`${environment.apiUrl}/users/${id}`, new_model);
  }  

  getUserById(id : String) : Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`);
  }  

  getUsersPage(filter:string, page_index: number =0, per_page:number=10) : Observable<UsersPage> { 
    return this.http.get<any>(`${environment.apiUrl}/users?${filter}page=${page_index+1}&per_page=${per_page}`);
  }

}
