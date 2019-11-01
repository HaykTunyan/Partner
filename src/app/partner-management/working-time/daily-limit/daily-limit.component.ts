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
  selector: 'daily-limit',
  templateUrl: './daily-limit.component.html',
  styleUrls: ['./daily-limit.component.scss'], 
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DailyLimitComponent implements OnInit {

  date1 = new FormControl(); // form for start time material input.
  date2 = new FormControl(); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  order;
  IsEdit = true;

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
  // function for input number validation.
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }
  // function for getting input values.
  getInputValues(value) {
    this.order = value;
  }

}
