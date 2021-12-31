import { Component, OnInit, Input } from '@angular/core';
import { HeaderCellModel } from './header-cell.model';

@Component({
  selector: 'app-complex-table',
  templateUrl: './complex-table.component.html',
  styleUrls: ['./complex-table.component.css']
})
export class ComplexTableComponent implements OnInit {

  @Input() title:String = 'Title';
  @Input() rows = [];
  @Input() header: HeaderCellModel[][];
  @Input() footer = {}

  displayedColumns = [];
  headerCells: HeaderCellModel[]=[];
  headerRows = [];
  lastHeaderRow = [];

  col:any;
  row:any;

  constructor() { }

  ngOnInit() {
    this.doSomeThingWithHeader();
  }

  doSomeThingWithHeader() {
      //header
      let last_header_row_i = this.header.length-1;
          
      this.header.forEach( (element,i) => {        
        this.headerCells.push(...element);
        if (i<last_header_row_i) { this.headerRows.push( element.map(e=> e.key) )}
        //last header row is keys !
        if (i==last_header_row_i) {    
          this.displayedColumns = element.map(e=> e.text) 
          this.lastHeaderRow = element.map(e=> e.key) 
        }
      });
  }
  cellClick(row, col){
    console.log(row, col)    
    if (col == '#') return;
    this.col = col;
    this.row = row;
  }
  isCellSelected(row, col) {
    return this.col == col && row == this.row;
    
  }
  isCellrowNumber(row, col){
    return col == '#';
  }
}
