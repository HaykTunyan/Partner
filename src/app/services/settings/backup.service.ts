import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  token: string;
  baseUrl = `${DOMAIN}settings`;
  header;

  constructor(private http: HttpClient) {
    this.getTokenFromLocalStorage ();
  }
  getTokenFromLocalStorage () {
    if (localStorage.getItem('menu-user')) {
      this.token = JSON.parse(localStorage.getItem('menu-user')).token;
    } else {
      this.token = ' ';
    }
    this.header = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer.${this.token}`});

  }
 // get backup times from back end.
  getBackupTimesArray() {
    return this.http.get(`${this.baseUrl}/backupSettings`, {headers: this.header});
  }
  // save new backup times changes.
  sendNewBackupDates(body) {
    return this.http.post(`${this.baseUrl}/backupSetting`, body, {headers: this.header});
  }
  // table pagination, sort and filter are got from back end.
  getBackupListWhitFilter(page, filterDate, sorting) {
    let queryParam = `?page=${page}&size=20`;
    filterDate.name ? queryParam += `&name=${filterDate.name}` : '';
    filterDate.date ? queryParam += `&backupDate=${filterDate.date}` : '';
    filterDate.time ? queryParam += `&backupTime=${filterDate.time}` : '';
    filterDate.type ? queryParam += `&type=${filterDate.type}` : '';
    filterDate.size ? queryParam += `&fileSize=${filterDate.size}` : '';
    if (sorting) {
      queryParam += `&sort=${sorting.name},${sorting.status}`;
    }
    const url = `${this.baseUrl}/backup_history_filter${queryParam}`;
    return this.http.get(url, {headers: this.header});
  }
}
