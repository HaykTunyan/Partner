import { Injectable } from '@angular/core';
import {DOMAIN} from '../partners/partners.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerCommisionRatService {

  constructor(private http: HttpClient) {}
  baseUrl = `${DOMAIN}commission_rate`;

  saveCommissionRate(data: any): Observable<any> {
    const url = `${this.baseUrl}/save`;
    return this.http.post(url, data);
  }
  getCommisionRate(id, deliveryType): Observable<any> {
    const url = `${this.baseUrl}/get_by_delivery_type_and_partner?deliveryType=${deliveryType}&id=${id}`;
    return this.http.get(url);
  }


}
