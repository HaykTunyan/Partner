// Partner Menu Service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { DOMAIN } from "../partners/partners.service" 


@Injectable({
  providedIn: 'root'
})

// export Partner Menu Service
export class PartnerMenuService {

  constructor(private http: HttpClient) { }

    baseUrl = `${DOMAIN}menu`;
  
    getAllMenu(): Observable<any> {
      const url = `${this.baseUrl}/all`;
       return this.http.get(url);
    }
  
}
