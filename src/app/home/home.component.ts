import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {from , merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {environment} from 'src/environments/environment'
import {MatSelectionList} from '@angular/material/list';
import {AuthenticationService} from '../login/authentication.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  default_page_size = 10;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSelectionList, {static: true}) cat_list: MatSelectionList;

  constructor(
    private route: ActivatedRoute,
    private _authService : AuthenticationService,

    ) { 

  }

  ngOnInit() {
    const qparams = this.route.snapshot.queryParams;
    this.paginator.pageIndex  = +qparams['page'] > 1 ? +qparams['page'] - 1 : 0;
    this.paginator.pageSize =  +qparams['per_page'] > 0 ? +qparams['per_page'] : this.default_page_size;

  }
}
