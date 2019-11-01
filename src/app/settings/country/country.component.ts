// Country Component

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CountryService} from '../../services/settings/country.service';
import {Router} from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export function ValidateEmail(control: AbstractControl) {
  if (control.value === '') {
    return null ;
  } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(control.value)) {
    return { validEmail: true };
  }
  return null;
}

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  generalInfo: any;
  payments: any;
  mailInputs: any = {
    'contentManagementMail': '',
    'logisticManagementMail': '',
    'marketingDepartmentMail': '',
    'productManagementMail': ''
  }; // mail inputs values.
  // mail inputs form controllers for validation
  contentManagementMail = new FormControl('', [
    ValidateEmail
  ]);
  logisticManagementMail = new FormControl('', [
    ValidateEmail
  ]);
  marketingDepartmentMail = new FormControl('', [
    ValidateEmail
  ]);
  productManagementMail = new FormControl('', [
    ValidateEmail
  ]);
  matcher = new MyErrorStateMatcher();
  mailSendTimer: any;
  IsEdit = false;
  constructor(private countryService: CountryService,  private router: Router) {
  }

  ngOnInit() {
    this.IsEdit = this. decideUserStatus();
    this.getGeneralInfo();
    this.getPayments();
    this.getEmailValues();
  }
  // log out function.
  logout() {
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
  // gets general info dada from backend
  getGeneralInfo() {
    this.countryService.GeneralInfoData().subscribe(data => {
      this.generalInfo = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // gets payments data from backend.
  getPayments() {
    this.countryService.getPayments().subscribe(data => {
      this.payments = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // gets email values from backend.
  getEmailValues() {
    this.countryService.getEmails().subscribe((data) => {
      if (data) {
        this.mailInputs = data;
      } else {
        this.mailInputs.forEach(function (element) {
          element = '';
        });
      }
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // activates or deactivates checkbox and send backend.
  activatePayment(index) {
    this.payments[index].active ? this.payments[index].active = false : this.payments[index].active = true;
    this.countryService.changePayments(this.payments[index]).subscribe(() => {
    }, error => {
      this.payments[index].active ? this.payments[index].active = false : this.payments[index].active = true;
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // gets mail values from inputs.
  inputEvent(value, name) {
    this.mailInputs[name] = value;
   if (this[name].valid) {
      this.sendMailsToBackEnd();
    }
  }
  // clears mail inputs values.
  clearInputValue(name) {
    this.mailInputs[name] = '';
    this.sendMailsToBackEnd();
  }
  // sends mails to backend.
  sendMailsToBackEnd() {
    clearTimeout(this.mailSendTimer);
    const mailInputs = this.mailInputs
  for (const key in mailInputs) {
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(mailInputs[key])) {
      mailInputs[key] = '';
    }
  }
  this.mailSendTimer = setTimeout(() => {
        this.countryService.changeEmail(mailInputs).subscribe(data => {
        }, error => {
          console.log(error);
          if (error.status === 401 || error.status === 403) {
            this.logout();
          }
        });
      }, 1500);
    }
}
