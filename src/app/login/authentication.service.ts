import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginModel } from './login.model'
import { User } from '../admin/user/user.model'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(login: string, password: string) {
        return this.http.post<LoginModel>(`${environment.apiUrl}/login`, { login, password })
            .pipe(map(resp => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(resp.user));
                localStorage.setItem('jwt', JSON.stringify(resp.jwt));
                this.userSubject.next(resp.user);
                return resp.user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}