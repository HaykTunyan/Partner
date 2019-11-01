// Brand Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Brand Service
export class BrandService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}brand`;

  getAllBrand(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
  addBrand(data: any): Observable<any> {
    const url = `${this.baseUrl}/save`;
    return this.http.post(url, data);
  }
  deleteBrandById(id): Observable<any> {
    const url = `${this.baseUrl}/delete?id=${id}`;
    return this.http.get(url);
  }
}
