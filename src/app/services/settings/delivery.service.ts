import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
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
  // get delivery data from back end.
  getDate() {
   return this.http.get(`${this.baseUrl}/deliverySetting`, {headers: this.header});
  }
// send changes and save beck end.
  sendData(body) {
    return this.http.post(`${this.baseUrl}/deliverySetting`, body, {headers: this.header});
  }
}
