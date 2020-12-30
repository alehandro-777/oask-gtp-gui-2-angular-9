import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { User, UsersPage } from '../../user.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from '../../users.service';
import {from ,fromEvent, merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  default_page_size = 10;

  activeFilter: string ='';
  users:User[];

  page_size = 10;
  
  //needed for paginator
  resultsLength = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('search', {static: false}) filter_input: ElementRef; 

  constructor(
    private route: ActivatedRoute,
    private _http : UsersService

  ) { }

  ngOnInit() {
    const qparams = this.route.snapshot.queryParams;
    this.paginator.pageIndex  = +qparams['page'] > 1 ? +qparams['page'] - 1 : 0;
    this.page_size =  +qparams['per_page'] > 0 ? +qparams['per_page'] : this.default_page_size;

    this.bindEvents();
    fromEvent(this.filter_input.nativeElement,'click').subscribe(d=>alert(d))
  }

  bindEvents(){
        // merge events
        merge(this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            
            const filter = this.activeFilter ? `name=${this.activeFilter}&` : '';
            return this._http.getUsersPage(
              filter,
              this.paginator.pageIndex,
              this.paginator.pageSize); 
         
          }),
          map(data => {
            this.resultsLength = data.total_count;
            return data;
          }),
          catchError(() => {
            return observableOf(new UsersPage);
          })
        ).subscribe(
          page => {
            this.resultsLength = page.total_count;
            this.users = page.data;
        })
  }

}
