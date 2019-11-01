// Menu Service 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Menu Service
export class MenuService {
  baseUrl = `${DOMAIN}menu`;

  constructor(private http: HttpClient) { }

  getAllMenues(page?): Observable<any> {
    const url = page ? `${this.baseUrl}/get_all?page=${page}` : `${this.baseUrl}/get_all`
    return this.http.get(url);
  }
  getFilterMenuByName(name, id?): Observable<any> {
    const url = id ? `${this.baseUrl}/menu_filter?name=${name}&&id=${id}` : `${this.baseUrl}/menu_filter?name=${name}`;
    return this.http.get(url);
  }
  getFilterMenuById(id, name?): Observable<any> {
    const url = name ? `${this.baseUrl}/menu_filter?id=${id}&&name=${name}` : `${this.baseUrl}/menu_filter?id=${id}`;
    return this.http.get(url);
  }
}
