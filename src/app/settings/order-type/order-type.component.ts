// Order Type Component

import { Component, OnInit } from '@angular/core';
import {OrderTypesService} from '../../services/settings/order-types.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order-type',
  templateUrl: './order-type.component.html',
  styleUrls: ['./order-type.component.scss']
})

export class OrderTypeComponent implements OnInit {
  deliveryData: any;
  orderGroupsData: any;
  modulesData: any;
  IsEdit = false;

  constructor(private dataService: OrderTypesService, private router: Router) { }

  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
    this.getDelivery();
    this.getOrderGroups();
    this.getModules();
  }
  // log out function.
  logout()  {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }

  // check user authentication and role status.
  decideUserStatus(): boolean {
    const menuUser = JSON.parse(localStorage.getItem('menu-user'));
    if (menuUser) {
      if (menuUser.token && menuUser.userDto) {
        if (Array.isArray(menuUser.userDto.roleDtos)) {
          for (let i = 0; i < menuUser.userDto.roleDtos.length; i++) {
            if (menuUser.userDto.roleDtos[i].name === 'Settings') {
              if (menuUser.userDto.roleDtos[i].action === 'EDIT') {
                i = Infinity;
                return true;
              } else if (menuUser.userDto.roleDtos[i].action === 'VIEW') {
                i = Infinity;
                return false;
              }
            }
          } this.logout();
        } else {
          this.logout();
        }
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  // get Delivery data from back end.
  getDelivery() {
    this.dataService.getDelivery().subscribe(data => {
      this.deliveryData = data;
    }, error => {
      if (error.status === 401) {
        this.logout();
      }
    });
  }

  // get order groups data from back end.
  getOrderGroups() {
    this.dataService.getOrderGroups().subscribe(data => {
      this.orderGroupsData = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  // get modules data from back end.
  getModules() {
    this.dataService.getModules().subscribe(data => {
      this.modulesData = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  // delivery change activate and send back end.
  activateDelivery(delivery, i) {
    const del = JSON.parse(JSON.stringify(delivery));
    delete del.name;
    del.active = !del.active;
    this.deliveryData[i].active =  del.active;
    this.dataService.changeDelivery(del).subscribe(data => {
    }, error => {
      this.deliveryData[i].active = !del.active;
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  // order groups activate and send back end
  activateOrderGroups(orderGroup, i) {
    const order = JSON.parse(JSON.stringify(orderGroup));
    order.active = !order.active;
    this.orderGroupsData[i].active =  order.active;
    this.dataService.changeOrderGroups(order).subscribe(data => {
    }, error => {
      this.orderGroupsData[i].active = !order.active;
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

  // modules activate and send back end
  activateModules(module, i) {
    const mod = JSON.parse(JSON.stringify(module));
    mod.active = !mod.active;
    this.modulesData[i].active =  mod.active;
    this.dataService.changeModules(mod).subscribe(data => {
    }, error => {
      this.modulesData[i].active = !mod.active;
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
}
