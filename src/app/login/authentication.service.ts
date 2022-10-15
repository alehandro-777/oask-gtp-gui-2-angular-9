import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<any>;
    private currDtSubject: BehaviorSubject<string>;
    private sideMenuSubject: BehaviorSubject<any>;
    private inputLockSubject: BehaviorSubject<boolean>;    
    private isUnsavedChangesSubject: BehaviorSubject<boolean>;

    public user: Observable<any>;
    public dt: Observable<string>;
    public side_menu: Observable<any>;
    public input_lock: Observable<boolean>;
    public isUnsavedChanges: Observable<boolean>;

    constructor( private router: Router, private http: HttpClient ) {
        this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.currDtSubject = new BehaviorSubject<string>("");
        this.dt = this.currDtSubject.asObservable();
        this.sideMenuSubject = new BehaviorSubject<any>({});
        this.side_menu = this.sideMenuSubject.asObservable();

        this.inputLockSubject = new BehaviorSubject<boolean>(true);
        this.input_lock = this.inputLockSubject.asObservable();
 
        this.isUnsavedChangesSubject = new BehaviorSubject<boolean>(false);
        this.isUnsavedChanges = this.isUnsavedChangesSubject.asObservable();

    }

    public get userValue(): any {
        return this.userSubject.value;
    }

    public get currentDateTime(): string {
        return this.currDtSubject.value;
    }

    public get currentSideMenu(): any {
        return this.sideMenuSubject.value;
    }

    public get currentInputLock(): boolean {
        return this.inputLockSubject.value;
    }

    public get hasChanges(): boolean {
        return this.isUnsavedChangesSubject.value;
    }

    setUnsavedChanges(payload : boolean) {
        this.isUnsavedChangesSubject.next(payload);
    } 

    changeInputLock(payload : boolean) {
        this.inputLockSubject.next(payload);
    } 

    clickSideMenu(payload : any) {
        this.sideMenuSubject.next(payload);
    }

    changeTime(newdt : string) {
        this.currDtSubject.next(newdt);        
    }

    login(login: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { login, password })
            .pipe(map(resp => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                let {jwt, ...user} = resp;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('jwt', JSON.stringify(jwt));
                this.userSubject.next(user);
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