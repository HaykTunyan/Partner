import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class ZoneConstructorService {
  token = JSON.parse(localStorage.getItem('menu-user')).token;
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer.${this.token}`});
  baseUrl = `${DOMAIN}zone`;

  constructor(private http: HttpClient) {
  }

  /**
   * for get all zone
   */
  getAllZone() {
    return this.http.get(this.baseUrl + '/all_zones', {headers: this.header});
  }


  /**
   * for get all zones by area
   * @param id -> id area
   */
  getAll_zones_by_area(id) {
    return this.http.get(`${this.baseUrl}/all_zones_by_area?id=${id}`, {headers: this.header});
  }

  /**
   * for added zone
   * @param form
   */
  addZone(form) {
    return this.http.post(this.baseUrl + '/save', form, {headers: this.header});
  }

  /**
   * for delete zone
   * @param id -> zone id
   */
  deleteZone(id) {
    return this.http.get(`${this.baseUrl}/delete_zone?id=${id}`, {headers: this.header});
  }


  /**
   * for update zone
   * @param form
   */
  updateZone(form) {
    return this.http.post(this.baseUrl + '/update_zone', form, {headers: this.header});
  }


  /**
   * for get all areas
   */
  getAllAreas() {
    return this.http.get(this.baseUrl + '/all_areas', {headers: this.header});
  }

  /**
   * for add area
   * @param form
   */
  addArea(form) {
    return this.http.post(this.baseUrl + '/save_area', form, {headers: this.header});
  }

  /**
   * for delete area
   * @param id
   */
  deleteArea(id) {
    return this.http.get(`${this.baseUrl}/delete_area?id=${id}`, {headers: this.header});
  }

  /**
   * for delete zone in area
   * @param id
   */
  deleteZoneFromArea(id) {
    return this.http.get(`${this.baseUrl}/delete_zone_from_area?id=${id}`, {headers: this.header});
  }

  /**
   * for update area
   * @param form
   */
  updateArea(form) {
    return this.http.post(this.baseUrl + '/update_area', form, {headers: this.header});
  }


}
