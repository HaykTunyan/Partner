import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOMAIN} from '../partners/partners.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  baseUrl = `${DOMAIN}images`;

  constructor(private http: HttpClient) { }
  saveImages(data): Observable<any> {
    const url = `${this.baseUrl}/save`;
    return this.http.post(url, data);
  }

  deleteImage(id): Observable<any> {
    const url = `${this.baseUrl}/delete?id=${id}`;
    return this.http.get(url);
  }
}
