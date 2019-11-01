// Delivery Settings Comonent

import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DeliveryService} from '../../services/settings/delivery.service';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import { default as _rollupMoment} from 'moment';
import {Router} from '@angular/router';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'll',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-delivery-settings',
  templateUrl: './delivery-settings.component.html',
  styleUrls: ['./delivery-settings.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DeliverySettingsComponent implements OnInit {

  data: any = {
    'bufferTime': 0,
    'deliveryRate': '',
    'deliveryTime': 0,
    'endDate': '',
    'itemQuantity': 0,
    'message': '',
    'partnerRate': true,
    'pickUpTime': 0,
    'preOrderTime': 0,
    'surgeDeliveryRate': '',
    'surgeDeliveryPercent': 0,
    'startDate': '',
    'vehicleSpeed': 0,
    'weightMultiplier': 0
  }; // delivery input values object.
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  IsEdit = false;
  constructor(private dataService: DeliveryService, private router: Router) {}
  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
    this.getData();
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
  // get data from back end.
  getData() {
    this.dataService.getDate().subscribe(data => {
      this.data = data;
      if (!this.data.deliveryRate) {
        this.data.deliveryRate = '';
      }
      if (!this.data.surgeDeliveryRate) {
        this.data.surgeDeliveryRate = '';
      }
      if (!this.data.surgeDeliveryPercent) {
        this.data.surgeDeliveryPercent = '';
      }
      if (!this.data.vehicleSpeed) {
        this.data.vehicleSpeed = '';
      }
      this.setDateForView();
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // sent changed data to back end.
  sendData() {
    const body = {
      bufferTime: isNaN(+this.data.bufferTime) ? 0 : +this.data.bufferTime,
      deliveryRate: isNaN(+this.data.deliveryRate) ? 0 : +this.data.deliveryRate,
      deliveryTime: isNaN(+this.data.deliveryTime) ? 0 : +this.data.deliveryTime,
      endDate: this.data.endDate,
      itemQuantity: isNaN(+this.data.itemQuantity) ? 0 : +this.data.itemQuantity,
      message: this.data.message,
      partnerRate: this.data.partnerRate,
      pickUpTime: isNaN(+this.data.pickUpTime) ? 0 : +this.data.pickUpTime,
      preOrderTime: isNaN(+this.data.preOrderTime) ? 0 : +this.data.preOrderTime,
      surgeDeliveryRate: isNaN(+this.data.surgeDeliveryRate) ? 0 : +this.data.surgeDeliveryRate,
      surgeDeliveryPercent: isNaN(+this.data.surgeDeliveryPercent) ? 0 : +this.data.surgeDeliveryPercent,
      startDate: this.data.startDate,
      vehicleSpeed: isNaN(+this.data.vehicleSpeed) ? 0 : +this.data.vehicleSpeed,
      weightMultiplier: isNaN(+this.data.weightMultiplier) ? 0 : +this.data.weightMultiplier,
  }
    this.dataService.sendData(body).subscribe(data => {
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // change date format for view.
  setDateForView() {
    if (this.data.startDate) {
      const startDate = new Date(this.data.startDate);
      this.startDate = startDate;
      // make start time
      startDate.getHours() < 10 ?
        this.firstTimeValue = '0' + startDate.getHours() :
        this.firstTimeValue = startDate.getHours();
      this.firstTimeValue +=  ':';
      startDate.getMinutes() < 10 ?
        this.firstTimeValue += '0' + startDate.getMinutes() :
        this.firstTimeValue += startDate.getMinutes();
    }
    if (this.data.endDate) {
      const endDate = new Date(this.data.endDate);
      this.endDate = endDate;
      // make end time
      endDate.getHours() < 10 ?
        this.secondTimeValue = '0' + endDate.getHours() :
        this.secondTimeValue = endDate.getHours();
      this.secondTimeValue +=  ':';
      endDate.getMinutes() < 10 ?
        this.secondTimeValue += '0' + endDate.getMinutes() :
        this.secondTimeValue += endDate.getMinutes();
    }
  }
  // change date format for back end.
  changeDateForBackEnd() {
    if (this.startDate && this.endDate) {
      const firstInputDate =  this.changeDateCompare(this.startDate);
      const secondInputDate = this.changeDateCompare(this.endDate);
        if (firstInputDate < secondInputDate) {
          this.data.startDate = this.changeDate(this.startDate,  this.firstTimeValue);
          this.data.endDate = this.changeDate(this.endDate,  this.secondTimeValue);
        } else if (this.startDate > this.endDate) {
          this.data.endDate = this.changeDate(this.startDate,  this.firstTimeValue);
          this.data.startDate = this.changeDate(this.endDate,  this.secondTimeValue);
        } else {
          if (this.firstTimeValue && this.secondTimeValue) {
            const firstHour = this.firstTimeValue[0] + this.firstTimeValue[1] +
              this.firstTimeValue[3] + this.firstTimeValue[4];
            const secondHour = this.secondTimeValue[0] + this.secondTimeValue[1] +
              this.secondTimeValue[3] + this.secondTimeValue[4];
            if (firstHour * 1 <= secondHour * 1) {
              this.data.startDate = this.changeDate(this.startDate,  this.firstTimeValue);
              this.data.endDate = this.changeDate(this.endDate,  this.secondTimeValue);
            } else {
              this.data.endDate = this.changeDate(this.startDate,  this.firstTimeValue);
              this.data.startDate = this.changeDate(this.endDate,  this.secondTimeValue);
            }
          } else if (this.firstTimeValue) {
            this.data.endDate = this.changeDate(this.startDate,  this.firstTimeValue);
            this.data.startDate = this.changeDate(this.endDate,  this.secondTimeValue);
          } else {
            this.data.startDate = this.changeDate(this.startDate,  this.firstTimeValue);
            this.data.endDate = this.changeDate(this.endDate,  this.secondTimeValue);
          }
        }
    } else if (this.startDate) {
      this.data.startDate = this.changeDate(this.startDate,  this.firstTimeValue);
    } else if (this.endDate) {
      this.data.endDate = this.changeDate(this.endDate,  this.secondTimeValue);
    }
  }
  // change date format
  changeDate(date, time) {
    let changedDate = '';
    changedDate += date.getFullYear() + '-';
    date.getMonth() + 1 < 10 ? changedDate += '0' + (date.getMonth() + 1) : changedDate += (date.getMonth() + 1);
    changedDate += '-';
    date.getDate() < 10 ? changedDate += '0' + date.getDate() : changedDate += date.getDate();
    changedDate += 'T';
    time ? changedDate += time + ':00'  : changedDate += '00:00:00';

   return changedDate;
  }
  // change dates for compare
  changeDateCompare(date) {
    let number: any = '';
    if (date) {
      number += date.getFullYear();
      date.getMonth() < 10 ? number += '0' + date.getMonth() : number +=  date.getMonth();
      date.getDate() < 10 ? number += '0' + date.getDate() : number += date.getDate();
      number = number * 1;
    }
    return number;
  }
  // function for getting checkbox value.
  partnerRateActivate() {
    this.data.partnerRate = !this.data.partnerRate;
  }
  // function for input number validation.
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }
  floatValidation(event, status) {
    if (isNaN(  this.data[status] + event.key) || event.charCode === 32) {
      return false;
    }
  }
  // function for getting input values.
  getInputValues(status, value) {
   this.data[status] = value;
  }
  // key press validation for material data picker.
  keyDownDateInput(event, status) {
    if (event.keyCode === 8) {
      if (status === 1) {
        this.startDate =  new FormControl(null);
      } else if (status === 2) {
        this.endDate = new FormControl(null);
      }
    } else {
      return false;
    }
  }
 // function for clear button near the inputs.
  clearInput(status) {
    this.data[status] = 0;
  }
  // function for border style of time inputs in time focus.
  focusFunction(status) {
   this[status] = true;
  }
  // function for border style of time inputs in time leave.
  focusOutFunction(status) {
    this[status] = false;
    if (status === 'firstTime') {
      if (this.firstTimeValue.length < 5) {
        this.firstTimeValue = '00:00';
      }
    } else if (status === 'secondTime') {
      if (this.secondTimeValue.length < 5) {
        this.secondTimeValue = '00:00';
      }
    }
  }
  // time inputs keypress validation.
  timeValidation(event, value, status) {
    this[status] = value;
    if (isNaN(+event.key) || event.charCode === 32) {
      return false;
    }
    if (this[status].length > 4) {
      return false;
    }
  }
  // change time format to correct format.
  changeTimeFormat(value, status) {
    this[status] = value;
    if (value.length === 2 ) {
      if ( value * 1 > 23) {
        this[status] = '23';
      }
      this[status] += ':';
    } else if (value.length === 5) {
      let string = value;
      const minutes = (string[3] + string[4] * 1);
      if (minutes > 59) {
        string = string[0] + string[1] + ':59';
        this[status] = string;
      }
    }
  }
  // get date from mat date input.
  getDate(event, status) {
    this[status] = event.value['_d'];
  }
  // clear keypress validation for time inputs.
  clearTimeDada(event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // press to cancel button.
  cancel() {
    this.getData();
  }
  // press to save button
  save () {
    this.changeDateForBackEnd();
    this.sendData();
  }
}
