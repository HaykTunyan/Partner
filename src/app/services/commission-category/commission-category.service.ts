// Commission Category Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Commission Category Service
export class CommissionCategoryService {

  constructor(private http: HttpClient) { }

baseUrl = `${DOMAIN}category`;

getAllCategory(): Observable<any> {
  const url = `${this.baseUrl}/all`;
  return this.http.get(url);
}
addCategory(data: any): Observable<any> {
  const url = `${this.baseUrl}/save_category`;
  return this.http.post(url, data);
}
getCategoryByName(name): Observable<any> {
  const url =  `${this.baseUrl}/get_by_name?name=${name}`;
  return this.http.get(url);
}
deleteCategoryById(id): Observable<any> {
  const url = `${this.baseUrl}/delete?id=${id}`;
  return this.http.get(url);
}


}
