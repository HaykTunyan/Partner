import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class OrderTypesService {
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

  getDelivery() {
    return this.http.get(`${this.baseUrl}/deliveryTypes`, {headers: this.header});
  }

  getOrderGroups() {
    return this.http.get(`${this.baseUrl}/orderGroups`, {headers: this.header});
  }

  getModules() {
    return this.http.get(`${this.baseUrl}/orderTypeModules`, {headers: this.header});
  }

  changeDelivery(body) {
    return this.http.post(`${this.baseUrl}/deliveryType`, body, {headers: this.header});
  }

  changeOrderGroups(body) {
    return this.http.post(`${this.baseUrl}/orderGroup`, body, {headers: this.header});
  }

  changeModules(body) {
    return this.http.post(`${this.baseUrl}/orderTypeModule`, body, {headers: this.header});
  }
}
