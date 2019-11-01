// Sections Category Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

// export Sections Category Servive 
export class SectionsCategoryService {

  constructor(private http: HttpClient) { }

  baseUrl = `${DOMAIN}section`;

  getAllSection(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
  addSection(data: any): Observable<any> {
    const url = `${this.baseUrl}/save_section`;
    return this.http.post(url, data);
  }
  getSectionsByName(name): Observable<any> {
    const url =  `${this.baseUrl}/get_by_name?name=${name}`;
    return this.http.get(url);
  }
  deleteSectionsById(id): Observable<any> {
    const url = `${this.baseUrl}/delete?id=${id}`;
    return this.http.get(url);
  }

}
