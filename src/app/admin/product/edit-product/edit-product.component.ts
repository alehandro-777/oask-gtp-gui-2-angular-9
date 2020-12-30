import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../../home/catalog.service';
import { Product, ProductsCategoryPage} from '../../../home/catalog.model'
import { first, catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {environment} from '../../../../environments/environment'

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent implements OnInit {
  
  @Input() product_id;
  @ViewChild("fileUpload", {static: false}) 
  
  fileUpload: ElementRef; 
  files  = [];

  categories$ : Observable<ProductsCategoryPage>;

  edit_model : Product;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _catalogService: CatalogService

  ) { }

  ngOnInit() {
    this.product_id  =  this.route.snapshot.params['id'];

    if (!this.product_id) {
      this.edit_model = new Product();
      this.buildForm(this.edit_model);
    }
    else {
      this._catalogService.getProductById(this.product_id).subscribe(
        product => {
          this.edit_model = product;
          this.buildForm(this.edit_model);
        }
      );
    }
    this.categories$ = this._catalogService.getProductsCatalog(0, 100);
}

buildForm(init_model : Product) {

  this.form = this.formBuilder.group({
    name: [init_model.name, Validators.required],
    description: [init_model.description, Validators.required],
    category: [init_model.category, Validators.required],
    price: [init_model.price, Validators.required],
    enabled: [init_model.enabled, ],

  });

}
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.edit_model.name = this.f.name.value;
      this.edit_model.description = this.f.description.value;
      this.edit_model.category = this.f.category.value;
      this.edit_model.price = this.f.price.value;
      this.edit_model.enabled = this.f.enabled.value;

      if (!this.edit_model._id) {
        this.createNew();
      }
      else {
        this.update();
      }
  }

  createNew(){
    this._catalogService.createProduct(this.edit_model)
    .pipe(first())
    .subscribe(
      prod => {
        this.edit_model = prod;
        this.router.navigate([`/editprod/${this.edit_model._id}`]);
      },
      error => {}
    );
  }

  update() {
    this._catalogService.updateProduct(this.edit_model)
    .pipe(first())
    .subscribe(
      prod => {
        this.router.navigate([`/editprod/${this.edit_model._id}`]); 
      },
      error => {}
    );
  }

setImgUri(filename : string)  {
 this.edit_model.image_uri = `${environment.apiUrl}/images/${filename}`;
}

  
uploadFile(file) {  
    const formData = new FormData();  
    formData.append('file', file.data);  
    file.inProgress = true;  
    this._catalogService.upload(formData).pipe(  
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
        if (typeof (event) === 'object') {  
          //console.log(event.body);
          this.setImgUri(event.body.filename);  
        }  
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
