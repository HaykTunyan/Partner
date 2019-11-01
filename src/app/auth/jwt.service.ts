import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
// JSON Web Token Service.
export class JwtService {
   url = environment.domain;
  constructor(private http: HttpClient) {
  }
  login(email: string, password: string) {
    const body = {
      email,
      password
    };
    return this.http.post(`${this.url}account/login`, body);
  }

  register(email: string, password: string) {
    return this.http.post<{ access_token: string }>(this.url, {email, password}).pipe(tap(res => {
        this.login(email, password);
      })
    );
  }

logout() {
  localStorage.removeItem('access_token');
}

public get loggedIn(): boolean {
  return localStorage.getItem('access_token') !==  null;
}

}
