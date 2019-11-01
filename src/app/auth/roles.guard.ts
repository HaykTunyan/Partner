import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
  menuUser = JSON.parse(localStorage.getItem('menu-user'));
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.menuUser) {
      this.logOut();
      return false;
    } else if (!this.menuUser.token || !this.menuUser.userDto) {
      this.logOut();
      return false;
    } else if (!Array.isArray(this.menuUser.userDto.roleDtos)) {
      this.logOut();
      return false;
    } else {
      for ( let i = 0; i < this.menuUser.userDto.roleDtos.length; i++) {
        if (next.data.role === this.menuUser.userDto.roleDtos[i].name) {
          i = Infinity;
          return true;
        }
      }
      return false;
    }
  }
  logOut() {
    localStorage.removeItem('menu-user');
    this.router.navigate(['/login']);
  }
}
