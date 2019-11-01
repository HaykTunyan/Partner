// Partners Service

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})

// export Partner Service
export class PartnersService {
  private partnerId = new BehaviorSubject<string>('');
  currentId = this.partnerId.asObservable();

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}partner`;
  token: string;
  header;
  getTokenFromLocalStorage () {
    if (localStorage.getItem('menu-user')) {
      this.token = JSON.parse(localStorage.getItem('menu-user')).token;
    } else {
      this.token = ' ';
    }
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer.${this.token}`});
  }

  changeId(id: string) {
    this.partnerId.next(id);
  }

  getAllPartner(): Observable<any> {
    const url = `${this.baseUrl}/get_all`;
    return this.http.get(url);
  }

  addPartner(data: any): Observable<any> {
    const url = `${this.baseUrl}/save_partner`;
    return this.http.post(url, data, {observe: 'response'});
  }

  getAllPartnerCategory(): Observable<any> {
    const url = `${this.baseUrl}/all_partner_categories`;
    return this.http.get(url);
  }

  getPartnerByName(name): Observable<any> {
    const url = `${this.baseUrl}/by_name?name=${name}`;
    return this.http.get(url);
  }

  saveTranslate(id, language_code, partnerTranslatableData) {
    const url = `${this.baseUrl}/save_translate?id=${id}&language_code=${language_code}`;
    return this.http.post(url, {name: partnerTranslatableData});
  }

  getPartnerById(id): Observable<any> {
    const url = `${this.baseUrl}/get_one?id=${id}`;
    return this.http.get(url);
  }

  getAllTranslations(id): Observable<any> {
    const url = `${this.baseUrl}/all_translations?id=${id}`;
    return this.http.get(url);
  }
  getPartnerByLimit(pageNumber, pageSize): Observable<any> {
    const url = `${this.baseUrl}/get_all_by_limit?page=${pageNumber}&size=${pageSize}`;
    return this.http.get(url);
  }
  getRoles() {
    this.getTokenFromLocalStorage ();
    return this.http.get(`${DOMAIN}account/get_all_roles`, {headers: this.header});
  }

  getPartnerFilter(page = 0, size = 20, filtr: any, sort: any = null): Observable<any> {
    let filterUrl = '';
    filtr.id? filterUrl += `&id=${filtr.id}`: '';
    filtr.name? filterUrl += `&name=${filtr.name}`: '';
    filtr.area? filterUrl += `&area=${filtr.area}`: '';
    filtr.zone? filterUrl += `&zona=${filtr.zone}`: '';
    filtr.phone? filterUrl += `&phone=${filtr.phone}`: '';
    filtr.order? filterUrl += `&order=${filtr.order}`: '';
    filtr.partnerType? filterUrl += `&partnerType=${filtr.partnerType}`: '';
    filtr.breand? filterUrl += `&breand=${filtr.breand}`: '';
    filtr.legalEntity? filterUrl += `&legal=${filtr.legalEntity}`: '';
    filtr.serviceType? filterUrl += `&serviceType=${filtr.serviceType}`: '';
    filtr.partnerCategory? filterUrl += `&partnerc=${filtr.partnerCategory}`: '';
    filtr.events? filterUrl += `&events=${filtr.events}`: '';
    filtr.campaigns? filterUrl += `&campaigns=${filtr.campaigns}`: '';
    filtr.bilingCycleNumber? filterUrl += `&bilingCycleNumber=${filtr.bilingCycleNumber}`: '';
    filtr.bilingCycleStartDate? filterUrl += `&bilingCycleStartDate=${filtr.bilingCycleStartDate}`: '';
    filtr.contractNumber? filterUrl += `&contractNumber=${filtr.contractNumber}`: '';
    filtr.gracePeriod? filterUrl += `&gracePeriod=${filtr.gracePeriod}`: '';
    filtr.maxCreditLimit? filterUrl += `&maxCreditLimit=${filtr.maxCreditLimit}`: '';
    filtr.orderPayment? filterUrl += `&orderPayment=${filtr.orderPayment}`: '';
    filtr.status? filterUrl += `&status=${filtr.status}`: '';
    filtr.openOrClose? filterUrl += `&openOrClose=${filtr.openOrClose}`: '';
    let sortUrl = '';
    sort ? sortUrl = `&sort=${sort.name},${sort.status}`: '';
    const url = `${this.baseUrl}/partner_filter?page=${page}&size=${size}${filterUrl}${sortUrl}`;
    return this.http.get(url)
  }
}
