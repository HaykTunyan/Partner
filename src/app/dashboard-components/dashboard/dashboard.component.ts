// Dashboard Component file.

import { Component, OnInit } from '@angular/core';

// Component
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

// export Dashboard Component 
export class DashboardComponent implements OnInit {
  dashboardData = [
    {
      icon: 'how_to_vote',
      name: 'CMS',
      routerLink: '',
      role: 'CMS'
    },
    {
      icon: 'ballot',
      name: 'Partner Management',
      routerLink: '/partner-list',
      role: 'Partner Management'
    },
    {
      icon: 'cake',
      name: 'Campaign Management',
      routerLink: '/campaign-management/campaign',
      role: 'Campaign Management'
    },
    {
      icon: 'departure_board',
      name: 'Logistics Management',
      routerLink: '',
      role: 'Logistics Management'
    },
    {
      icon: 'directions_car',
      name: 'Couriers Dispatch Management',
      routerLink: '',
      buttonName: 'Go To Platform',
      role: 'Couriers Dispatch Management'
    },
    {
      icon: 'headset_mic',
      name: 'Customer Support',
      routerLink: '',
      role: 'Customer Support'
    },
    {
      icon: 'assessment',
      name: 'Reporting',
      routerLink: '',
      role: 'Reporting'
    },
    {
      icon: 'perm_identity',
      name: 'User Management',
      routerLink: '/user-management',
      role: 'User Management'
    },
    {
      icon: 'place',
      name: 'Zone Constructor',
      routerLink: '/zone',
      role: 'Zone Constructor'
    },
    {
      icon: 'business_center',
      name: 'Company Management',
      routerLink: '',
      role: 'Company Management'
    },
    {
      icon: 'monetization_on',
      name: 'Finance Management',
      routerLink: '',
      role: 'Financial'
    },
    {
      icon: 'settings',
      name: 'Settings',
      routerLink: '/settings/country',
      role: 'Settings'
    }
  ];
  userData;
  roleNames: any;
  // constructor 
  constructor() { }

  // ngOnInit
  ngOnInit() {
    this.getUserDataFromLocalStorage();
    this. disabledOrEnabledButtons();
  }
  // get user data from local storage.
  getUserDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('menu-user'));
    if ( data ) {
      if (data.userDto) {
        this.userData = data.userDto;
      }
    }
  }
  // enable and disable dashboard buttons.
  disabledOrEnabledButtons() {
    if (Array.isArray(this.userData.roleDtos)) {
      this.roleNames = {};
      for (let i = 0; i <  this.userData.roleDtos.length; i++) {
        this.roleNames[this.userData.roleDtos[i].name] = true;
      }
    }
  }
}
