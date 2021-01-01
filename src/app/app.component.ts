import { Component, OnInit } from '@angular/core';
import {FormService} from './forms/form.service'
import {AuthenticationService} from './login/authentication.service'
import { BehaviorSubject, Observable } from 'rxjs';
import {User} from './admin/user/user.model'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user$ : Observable<User>;

  constructor(
    private _authService : AuthenticationService,
    private _formService : FormService,
    private route: ActivatedRoute,
    private router: Router, 
    ) {}

  ngOnInit() {
    this.user$ = this._authService.user;
  }



  logout(){
    this._authService.logout(); 
  }

}

