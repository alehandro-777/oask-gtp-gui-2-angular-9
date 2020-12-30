import { Input, Component, ViewChild, OnInit } from '@angular/core';
import {TableHttpService} from './table.services';
import {MatPaginator} from '@angular/material/paginator';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {from , merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'table-http',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {
 
  title = "Мринське ВУ ПЗГ";
  //table data array
  api_data = {};
  displayedColumns = [];

  @Input() curr_form_id: string = "4";
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( private dataService: TableHttpService, private route: ActivatedRoute) {
  }

  ngOnInit(){
    this.btnUpdateClick();
  }

  formChanged(event){
    //alert(JSON.stringify(event)); 
    this.curr_form_id = event._id;
    this.btnUpdateClick();
  }

  btnUpdateClick(){
    this.dataService.getHttpData(this.curr_form_id).subscribe(api_result => {
      
      this.displayedColumns = this.getDisplayedCols(api_result);

      this.paginator.length = api_result.link.total_count;
      this.paginator.pageSize = api_result.link.per_page;

      this.api_data = api_result;
    })
  }

  getDisplayedCols(api_data : any) :any[] {
    return api_data.header.map(cell=> cell.id);
  }

}



