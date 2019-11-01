import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerContactsService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}partner_contacts`;

  getPartnerContactsType(): Observable<any> {
    const url = `${this.baseUrl}/get_types`;
    return this.http.get(url);
  }
}
