import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class FlowSettingsService {
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
  // get flow stop data from backend.
  getFlowStop() {
    return this.http.get(`${this.baseUrl}/flowStopConditions`, {headers: this.header});
  }
  // gwt payment data from backend.
  getPayments () {
    return this.http.get(`${this.baseUrl}/paymentSettings`, {headers: this.header});
  }
  // send flow stop changed dada to backend.
  sendFlowStops(body) {
    return this.http.post(`${this.baseUrl}/flowStopCondition`, body, {headers: this.header});
  }
  // get general acceptable status from backend.
  getGeneralAcceptableStatus () {
    return this.http.get(`${this.baseUrl}/generalAcceptableStatus`, {headers: this.header});
  }
  sendGeneralAcceptableStatus (body) {
    return this.http.post(`${this.baseUrl}/generalAcceptableStatus`, body, {headers: this.header});
  }
  getAcceptableStatus () {
    return this.http.get(`${this.baseUrl}/acceptableStatus`, {headers: this.header});
  }
  // make status delays url for filter and get  status delays date buy pagination.
  getAcceptableStatusDelays (page = 0, size = 20, filter, sorting) {
    let queryParam = `${this.baseUrl}/acceptable_status_delay_filter`;
     queryParam += `?page=${page}&size=${size}`;
     if (filter) {
       queryParam += `&statuses.name=${filter}`;
     }
     if (sorting) {
       queryParam += `&sort=${sorting.name},${sorting.status}`;
     }
    return this.http.get(queryParam, {headers: this.header});
  }
  // send status delays changed data to backend for saving.
  changeStatus(body) {
    return this.http.post(`${this.baseUrl}/updateAcceptableStatusDelay`, body, {headers: this.header});
  }
  // send new status delays data to backend to save.
  saveStatus(body) {
    return this.http.post(`${this.baseUrl}/acceptableStatusDelay`, body, {headers: this.header});
  }
}
