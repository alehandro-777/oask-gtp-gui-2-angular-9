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

  gasday:string = "2021-12-01";
  gastime:string = "07:00";

  gasdt:string = "2021-12-01T07:00";


  constructor(
    private _authService : AuthenticationService,
    private _formService : FormService,
    private route: ActivatedRoute,
    private router: Router, 
    ) {}

  ngOnInit() {
    this.user$ = this._authService.user;
    this._authService.changeTime(this.gasdt);
  }

  DateChanged(e){
    this.gasday = e.target.value;
    this.gasdt = this.gasday +"T"+this.gastime;
    this._authService.changeTime(this.gasdt);
  }

  TimeChanged(e){
    this.gastime = e.target.value;
    this.gasdt = this.gasday +"T"+this.gastime;
    this._authService.changeTime(this.gasdt);
  }

  logout(){
    this._authService.logout(); 
  }

  panelClick(id) {
    console.log("Navigate", id);
    switch (id) {
      case "1":
        this.router.navigate(['/dashboard' ]);    
        break;
        
        case "2":
          this.router.navigate(['/home' ]);    
         break;

        case "3":
          this.router.navigate(['/tabledash' ]);    
         break;      

      default:
        break;
    }
    
  }
}

