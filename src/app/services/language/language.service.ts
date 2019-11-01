// Language Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Language Service
export class LanguageService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}languages`;

  getLanguages(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }

}
