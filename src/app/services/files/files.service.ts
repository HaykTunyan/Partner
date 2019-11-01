import { Injectable } from '@angular/core';
import {DOMAIN} from '../partners/partners.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}files`;

  saveFile(uploadData: any, type) : Observable<any> {
    const url = `${this.baseUrl}/save?TYPE=${type}`;
    // console.log(this.http.post(url, uploadData));
    return this.http.post(url, uploadData, {
      responseType: 'text'
    });
  }
  getImageType(): Observable<any> {
    const url = `${this.baseUrl}/get_allowed_file_types`;
    return this.http.get(url);
  }
}
