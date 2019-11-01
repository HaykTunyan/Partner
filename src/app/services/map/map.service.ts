import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DOMAIN} from '../partners/partners.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }
  baseUrl = `https://nominatim.openstreetmap.org/search`;

  getCoordinates(country, city, street, houseNumber ): Observable<any> {
    const url = `${this.baseUrl}/${country}?format=json&city=${city}&street=${street}&house_number=${houseNumber}`;
    return this.http.get(url);
  }
}
