import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

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
  selector: 'deactivate-period',
  templateUrl: './deactivate-period.component.html',
  styleUrls: ['./deactivate-period.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DeactivatePeriodComponent implements OnInit {

  timePeriodIndex = 0; // checked time period index.
  date1 = new FormControl(); // form for start time material input.
  date2 = new FormControl(); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  firstTime = false;
  secondTime = false;
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  constructor() { }

  ngOnInit() {
  }

  // get date from mat date input.
  getDate(event, status) {
    this[status] = event.value['_d'];
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
  // clear keypress validation for time inputs.
  clearTimeDada(event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
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
}
