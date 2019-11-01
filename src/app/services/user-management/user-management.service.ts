// User Management Service
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})

export class UserManagementService {

  constructor(private http: HttpClient) {
  }
  baseUrl = `${DOMAIN}account`;
  token = JSON.parse(localStorage.getItem('menu-user')).token;
  header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer.${this.token}`});
  // for getting users data
  getUsersByPagination(page, count) {
    return this.http.get(`${this.baseUrl}/get_all_by_limit?page=${page}&size=${count}`, {headers: this.header});
  }

  // for getting roles
  getRolesArray() {
    return this.http.get(`${this.baseUrl}/get_all_roles`, {headers: this.header});
  }

  // create new user
  createUser(user) {
    return this.http.post(`${this.baseUrl}/save`, user, {headers: this.header});
  }

  // change user
  changeUser(user) {
    return this.http.post(`${this.baseUrl}/update`, user, {headers: this.header});
  }

  // delete user
  deleteUser(user) {
    return this.http.post(`${this.baseUrl}/delete?id=${user.id}`, null, {headers: this.header});
  }

  downloadUserList() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer.${this.token}`,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'true'
    });
    // , {headers: header}
    return this.http.get(`${this.baseUrl}/download_users_list`,  {headers: this.header});
  }

  // get all users by using filter and pagination
  getByFilter(filter, page = 0, count = 20, sort) {
    let queryParam = `?page=${page}&size=${count}`;
    filter.name ? queryParam += `&name=${filter.name}` : '';
    filter.email ? queryParam += `&email=${filter.email}` : '';
    filter.phoneNumber ? queryParam += `&phone=${filter.phoneNumber}` : '';
    filter.role ? queryParam += `&roleSet.role.role=${filter.role}` : '';
    filter.date ? queryParam += `&createDate=${filter.date}` : '';
    if (sort) {
      queryParam += `&sort=${sort.name},${sort.status}`;
    }
    return this.http.get(`${this.baseUrl}/user_filter${queryParam}`, {headers: this.header});
  }

  // send request for reset password or resend invitation
  resetPasswordOrInvitation(id, active) {
    let activeOrChange = '';
    if (active) {
      activeOrChange = 'reset_password_send_email';
    } else {
      activeOrChange = 'resend_invitation_mail';
    }
    return this.http.get(`${this.baseUrl}/${activeOrChange}?id=${id}`, {headers: this.header});
  }
}
