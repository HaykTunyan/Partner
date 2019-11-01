import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOMAIN} from '../partners/partners.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerCommissionRateThresholdService {

  constructor(private http: HttpClient) {}
  baseUrl = `${DOMAIN}commission_rate_threshold`;


  saveCommissionRateThreshold(data: any): Observable<any> {
    const url = `${this.baseUrl}/save`;
    return this.http.post(url, data);
  }
}
