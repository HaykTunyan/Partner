// Account Service.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOMAIN } from '../partners/partners.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

// export Account Service
export class AccountService {

  constructor(private http: HttpClient) { }
  baseUrl = `${DOMAIN}account`;

  addAccountPartner(data): Observable<any> {
    const url = `${this.baseUrl}/save_partner_user`;
    return this.http.post(url, data);
  }
  resendInvitationEmail(id) {
    const url = `${this.baseUrl}/resend_invitation_mail?id=${id}`;
    return this.http.get(url);
  }
  resetPasswordSendEmail(id) {
    const url = `${this.baseUrl}/reset_password_send_email?id=${id}`;
    return this.http.get(url);
  }
}
