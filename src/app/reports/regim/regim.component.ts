import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {RegimService} from './regim.service'
import {MatTable} from '@angular/material/table';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-regim',
  templateUrl: './regim.component.html',
  styleUrls: ['./regim.component.css']
})
export class RegimComponent implements OnInit {
  constructor(private router: Router, private dataService: RegimService) { }
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  title:'Title';
  displayedColumns = [];
  rows = [];
  headerCells = [];
  headerRows = [];
  lastHeaderRow = [];
  header = [];
  footer = {}
  gasday = "2021-01-01";

  ngOnInit(){

  }

  DateChanged(e){
    this.gasday = e.target.value;
  }

  btnExcelClick(id:string){
    
    this.dataService.getHttpExcel(id, this.gasday).subscribe(api_result => {
      console.log(api_result)
      saveAs(api_result,'freport1.xlsx')
    })
  }

  btnUpdateClick(id:string){
    
    this.dataService.getHttpData(id, this.gasday).subscribe(api_result => {
      
     // let headCells = [];
     // let headRows = [];

      this.header = api_result.header;
      //header
      let last_header_row_i = this.header.length-1;
      this.headerCells.length =0;
      this.headerRows.length = 0;     
      this.displayedColumns.length=0;
      this.rows = api_result.rows;
      this.footer = api_result.footer ? api_result.footer : [];
      
      this.header.forEach( (element,i) => {
        
        this.headerCells.push(...element);
        if (i<last_header_row_i) { this.headerRows.push( element.map(e=> e.key) )}
        //last header row is keys !
        if (i==last_header_row_i) {
    
          this.displayedColumns = element.map(e=> e.text) 
          this.lastHeaderRow = element.map(e=> e.key) 
        }
      });

      //this.headerCells = headCells;
      //this.headerRows = headRows;     
      
      //console.log(this.headerCells)
      //console.log(this.headerRows)
      //console.log(this.displayedColumns)
    })

  }
}
