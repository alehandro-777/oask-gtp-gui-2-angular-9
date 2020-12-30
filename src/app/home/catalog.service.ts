import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { from, Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Product, ProductCategory, ProductsPage, ProductsCategoryPage } from './catalog.model'
import {environment} from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})

export class CatalogService {
  constructor(
    private http: HttpClient
    ) { 

    }

  createProduct(new_product : Product) : Observable<Product> {
    return this.http.post<any>(`${environment.apiUrl}/products`, new_product);
  } 

  updateProduct(new_product : Product) : Observable<Product> {
    const id = new_product._id;
    return this.http.put<any>(`${environment.apiUrl}/products/${id}`, new_product);
  }  

  getProductById(id : string) : Observable<Product> {
    return this.http.get<any>(`${environment.apiUrl}/products/${id}`);
  }  

  getProductsCatalog(page_index: number =0, per_page:number=10) : Observable<ProductsCategoryPage> { 
    return this.http.get<any>(`${environment.apiUrl}/categories?page=${page_index+1}&per_page=${per_page}`);
  }

  getProductsPage(filter:string, sort: string, order: string, page: number=0, per_page:number=10) : Observable<ProductsPage> { 
    return this.http.get<any>(`${environment.apiUrl}/products?${filter}&page=${page+1}&per_page=${per_page}`);  
  }

  upload(formData){
    return this.http.post<any>(`${environment.apiUrl}/image`, formData, {  
      reportProgress: true,  
      observe: 'events'  
    }); 
  }

}
