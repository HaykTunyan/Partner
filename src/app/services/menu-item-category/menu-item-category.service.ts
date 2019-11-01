import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOMAIN} from '../partners/partners.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuItemCategoryService {

  constructor(private http: HttpClient) {}
  baseUrl = `${DOMAIN}item_category`;

  getMenuItemCategory(): Observable<any> {
    const url = `${this.baseUrl}/all`;
    return this.http.get(url);
  }
}
