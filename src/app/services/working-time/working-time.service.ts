// Working Time Service.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/index';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})

// export Working Time Service
export class WorkingTimeService {

  constructor(private http: HttpClient) {}


  private shedulingId = new BehaviorSubject<string>('');
  shedulId = this.shedulingId.asObservable();

  baseUrl = `${DOMAIN}partner_scheduling`;

  changeId(id: string) {
    this.shedulingId.next(id);
  }

  getAllPartner(): Observable<any> {
    const url = `${this.baseUrl}/get_all`;
    return this.http.get(url);
  }

  addPartner(data: any): Observable<any> {
    const url = `${this.baseUrl}/get_all_day_exceptions_by_partner`;
    return this.http.post(url, data, {observe: 'response'});
  }

  getAllPartnerCategory(): Observable<any> {
    const url = `${this.baseUrl}/partner_scheduling/delete_by_day_and_partner`;
    return this.http.get(url);
  }

  getPartnerByName(name): Observable<any> {
    const url = `${this.baseUrl}/by_name?name=${name}`;
    return this.http.get(url);
  }

  saveTranslate(id, language_code, partnerTranslatableData) {
    const url = `${this.baseUrl}/partner_scheduling/save_reminder?id=${id}&language_code=${language_code}`;
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
}
