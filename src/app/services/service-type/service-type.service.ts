// Service Type Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

// export Service Type Service
export class ServiceTypeService {

  constructor(private http: HttpClient) { }


  baseUrl = `${DOMAIN}type`;

  getAllTypes(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
  addTypes(data: any): Observable<any> {
    const url = `${this.baseUrl}/save_type`;
    return this.http.post(url, data);
  }
  getTypesByName(name): Observable<any> {
    const url =  `${this.baseUrl}/get_by_name?name=${name}`;
    return this.http.get(url);
  }
  deleteTypesById(id): Observable<any> {
    const url = `${this.baseUrl}/delete?id=${id}`;
    return this.http.get(url);
  }
}
