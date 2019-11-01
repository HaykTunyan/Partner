// Create Product.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Create Product Service
export class CreateProductService {

  constructor(private http: HttpClient) { }

  baseUrl = `${DOMAIN}product`;

  getAllProduct(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
  addProduct(data: any): Observable<any> {
    const url = `${this.baseUrl}/save_product`;
    return this.http.post(url, data);
  }
  getProductByName(name): Observable<any> {
    const url =  `${this.baseUrl}/get_by_name?name=${name}`;
    return this.http.get(url);
  }
  deleteProductById(id): Observable<any> {
    const url = `${this.baseUrl}/delete?id=${id}`;
    return this.http.get(url);
  }

}
