import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  baseUrl = `${DOMAIN}account`;
  constructor(private http: HttpClient) { }

  // confirm new password after activation or change password after reset.
  sendNewPassword(password, token, address) {
    let url;
    address === 'activate' ? url = '/activate' : url = '/reset_password';
    return this.http.post(`${this.baseUrl}${url}`, {
      token: token,
      password: password
    });
  }
  // send email for change password.
  sendMailForgotPassword(bodey) {
    return this.http.post(`${this.baseUrl}/forget_password`, bodey);
  }
}
