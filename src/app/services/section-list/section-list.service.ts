import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class SectionListService {

  constructor(private http: HttpClient) {
  }
  token: string;
  header;
  baseUrl = `${DOMAIN}menu_sections`;
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

  getCategory(){
    return this.http.get(`${this.baseUrl}/get_all_section_category`)
  }

  getByFilter(page = 0, count = 20, filter, sort) {
    this.getTokenFromLocalStorage ();
    let queryParam = `?page=${page}&size=${count}`;
    filter.id ? queryParam += `&id=${filter.id }` : '';
    filter.name ? queryParam += `&engName=${filter.name}` : '';
    filter.category ? queryParam += `&category.name=${filter.category }` : '';
    if (sort) {
      queryParam += `&sort=${sort.name},${sort.status}`;
    }
    console.log(queryParam);
    return this.http.get(`${this.baseUrl}/menu_section_filter${queryParam}`/*, {headers: this.header}*/);
  }
  saveSection(body) {
    return  this.http.post(`${this.baseUrl}/save_section`, body);
  }
  changeSection(body) {
    return  this.http.post(`${this.baseUrl}/update_section`, body);
  }
  deleteSection(id) {
    return this.http.get(`${this.baseUrl}/delete_menu_section?id=${id}`);
  }
}
