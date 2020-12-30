import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { first, catchError, map } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { FileUploadService } from '../file-upload.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef; 
  
  files  = [];

  @Output() file_info = new  Subject<any>();

  constructor(
    private _http : FileUploadService,

  ) { }

  ngOnInit() {

  }

  uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this._http.upload(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        return of(`${file.data.name} upload failed.`);  
      }))
      .subscribe((event: any) => {  
        this.file_info.next(event);
      });  
}

private uploadFiles() {  
    this.fileUpload.nativeElement.value = '';  
    this.files.forEach(file => {  
      this.uploadFile(file);  
    });  
}

onUploadClick() {  
    const fileUpload = this.fileUpload.nativeElement;
    
    fileUpload.onchange = () => {  
    for (let index = 0; index < fileUpload.files.length; index++)  
    {  
     const file = fileUpload.files[index];  
     this.files.push({ data: file, inProgress: false, progress: 0});  
    }  
      this.uploadFiles();  
    };  
    fileUpload.click();  
}

}
