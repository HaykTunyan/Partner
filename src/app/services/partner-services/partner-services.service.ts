// Partner Services

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Partner Services Service
export class PartnerServicesService {

  constructor(private http: HttpClient) { }
   baseUrl = `${DOMAIN}partner_services`;

  getAllServiceCategories(): Observable<any> {
    const url = `${this.baseUrl}/get_all_service_categories`;
    return this.http.get(url);
  }

  getAllServiceTypes(): Observable<any> {
    const url = `${this.baseUrl}/get_all_service_types`;
    return this.http.get(url);
  }

}
