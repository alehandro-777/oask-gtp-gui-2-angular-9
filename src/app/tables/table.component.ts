import { Input, Component, Output, OnInit, EventEmitter } from '@angular/core';
import { HeaderModel } from '../tables/table-model';

@Component({
  selector: 'table-http',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() rows = [{}];
  @Input() header : HeaderModel[];  
  @Input() length : Number = 100;
  @Input() pageSize : Number= 20;
  @Input() pageIndex : Number = 0;
  @Input() title : String ="Table title";
  
  @Output() pageChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns : String[];
  selectedRow :any={};
  
  constructor() {
  }

  onRowClick(row) {
    this.selectedRow = row;
    this.rowSelected.emit(row);
  }

  isRowSelected(row) : boolean{
    return this.selectedRow == row;
  }

  ngOnInit(){
    this.displayedColumns = this.header.map(e=>e.id);
  }
  
  //paginator page changed
  onPaginate(event) {
    //alert(JSON.stringify(event));
    this.pageChanged.emit(event);
  }

  formChanged(event){

  }

  btnUpdateClick(){

  }

  openDialogForm(){

  }

}



