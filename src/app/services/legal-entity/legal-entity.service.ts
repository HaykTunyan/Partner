// Legal Entity Service 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})

// export Legal Entity Service
export class LegalEntityService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}legal_entity`;

  getAllLegalEntity() {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
  svaeNewLegalEntiti(bodey) {
    return this.http.post(`${this.baseUrl}/save`, bodey);
  }
  ubdateLegalEntiti(bodey) {
    return this.http.post(`${this.baseUrl}/update`, bodey);
  }
  getLegalEntitiByFilter(page = 0, caunt = 20, filter, sort) {
    let filterUrl = '';
    filter.id ? filterUrl += `&&id=${filter.id}` : filterUrl += '';
    filter.name ? filterUrl += `&&name=${filter.name}` : filterUrl += '';
    filter.address ? filterUrl += `&&address=${filter.address}` : filterUrl += '';
    filter.bank ? filterUrl += `&&bank=${filter.bank}` : filterUrl += '';
    filter.bankNumber ? filterUrl += `&&bankNumber=${filter.bankNumber}` : filterUrl += '';
    let sortUrl = '';
    sort.status ? sortUrl = `&sort=${sort.name},${sort.status}` : sortUrl = '';
    const url = `${this.baseUrl}/legal_entity_filter?page=${page}&&size${caunt}${filterUrl}${sortUrl}`;
    console.log(url);
    return this.http.get(url);
  }
  getPartnersByLegalEntity (id) {
    return this.http.get(`${DOMAIN}partner/by_legal_entity?id=${id}`);
  }
}
