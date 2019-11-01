// Auth Service

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// export Auth Service
export class AuthService {
  correctPasswordAndLogin: Subject <string> = new Subject();
  constructor( private router: Router, private _http: HttpClient, private jwt: JwtService) { }
  loggedIn () {
    let user: any = localStorage.getItem('menu-user');
    let token: any;
    user =  JSON.parse(user)
    if (user) {
      token = user.token;
    }
    return !!token;
  }
  login(user: User) {
    this.jwt.login(user.email, user.password).subscribe( (data: any) => {
      localStorage.removeItem('menu-user');
      this.correctPasswordAndLogin.next('');
      const localStorageData = JSON.stringify(data);
      localStorage.removeItem('menu-user');
      localStorage.setItem('menu-user', localStorageData);
      this.router.navigate(['/dashboard']);
    }, error => {
      if (error.status === 401) {
        localStorage.removeItem('menu-user');
        this.correctPasswordAndLogin.next('unauthorised');
      } else {
        localStorage.removeItem('menu-user');
        this.correctPasswordAndLogin.next('serverError');
      }
    });
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }

}
