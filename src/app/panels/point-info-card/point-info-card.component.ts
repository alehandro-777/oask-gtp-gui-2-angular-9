import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';


/*
        {
            "name": "Qвог.митт.",
            "short_name": "Q",
            "full_name": "Мринське ВУПЗГ.ВОГ ПСГ Мрин.",
            "type": "number",
            "eu": "т.м3/год",
            "min": "0",
            "max": "1000000",
            "step": "1",
            "deadband": 0,
            "min_rate": 0,
            "readonly": false,
            "params": [],
            "deleted": false,
            "_id": 1,
            "__v": 0,
            "created_at": "2021-12-07T12:13:17.022Z",
            "updated_at": "2021-12-07T12:13:17.022Z"
        }
*/

@Component({
  selector: 'app-point-info-card',
  templateUrl: './point-info-card.component.html',
  styleUrls: ['./point-info-card.component.css']
})
export class PointInfoCardComponent implements OnInit {
  @Input() point: Number =1;

  isDigitalObject : boolean = false;
  isCalculated : boolean = false;
  pntInfo : any = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadInfo();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.loadInfo();
  }

  loadInfo() {
    this.getPointInfo(this.point).subscribe( pntInfo=>{
        //alert(JSON.stringify(...));
        this.isCalculated = pntInfo.func ? true : false; 
        this.pntInfo = pntInfo.data;
        if (this.pntInfo.type == "select") {
          this.isDigitalObject = true;
        } else {
          this.isDigitalObject = false;
        }    
    });
  }
  
  getPointInfo(point:Number) : Observable<any> { 
    return this.http.get<any>(`${environment.apiUrl}/db-points/${point}?include=options`);
  }
}
