// Country Service.

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  token: string;
  header;
  baseUrl = `${DOMAIN}settings`;

  constructor(private http: HttpClient) {
    this.getTokenFromLocalStorage ();
  }
  getTokenFromLocalStorage () {
    if (localStorage.getItem('menu-user')) {
      this.token = JSON.parse(localStorage.getItem('menu-user')).token;
    } else {
      this.token = ' ';
    }
    this.header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer.${this.token}`});
  }

  GeneralInfoData() {
    return this.http.get(`${this.baseUrl}/company`, {headers: this.header});
  }

  getPayments() {
    return this.http.get(`${this.baseUrl}/paymentSettings`, {headers: this.header});
  }

  getEmails() {
    return this.http.get(`${this.baseUrl}/mailSetting`, {headers: this.header});
  }

  changePayments(body) {
    return this.http.post(`${this.baseUrl}/paymentSetting`, body, {headers: this.header});
  }

  changeEmail(body) {
    return this.http.post(`${this.baseUrl}/mailSetting`, body, {headers: this.header});
  }
}
