// Menu Sheduling Component.

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS, } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'menu-sheduling',
  templateUrl: './menu-sheduling.component.html',
  styleUrls: ['./menu-sheduling.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

// export Menu SHeduling Component.
export class MenuShedulingComponent implements OnInit {

//Working schedule head data

showlist = true;

startDate = new Date(1990, 0, 1);
startDay = new Date( 2018, 9, 17 )

elements: any = [
  {id: 'MON', from: '09:00', to: '18:00'},
  {id: 'TUE', from: '09:00', to: '18:00'},
  {id: 'WED', from: '09:00', to: '18:00'},
  {id: 'THU', from: '09:00', to: '18:00'},
  {id: 'FRI', from: '09:00', to: '18:00'},
  {id: 'SAT', from: '09:00', to: '18:00'},
  {id: 'SUN', from: '09:00', to: '18:00'}
];

headElements = ['', 'From', 'To'];

periodElement = ['Sep 27, 2018', '11:30', '15:30', 'Nov 11, 2018'];

dateTime = new FormControl(new Date());
serializedDate = new FormControl((new Date()).toISOString());

// 
date = new Date(new Date().getFullYear(), new Date().getMonth() );
  // previusButton = false;
  daysArray: any [];
  weeknames = ['MON', 'TUE', 'WEB', 'THU', 'FRI', 'SAT', 'SUN',];
  popUp = false;
  popupAnimationState = 'start';
  day = 0;
  week: Date;
  heidText = false;
  cangeableAnimationState = 'end';
  eventsArray = new Array(31);

  createEventsArray(){
    for(var i = 0; i<=10; i++){
      this.eventsArray[Math.round(Math.random()*31)] = true;
    }
  }

  constructor() { }

  ngOnInit() {
   this.createDaysArray();
   this.createEventsArray();
  }


  nextMounth(){
    this.createEventsArray();
    if (this.date.getMonth() == 11) {
      this.date = new Date(this.date.getFullYear() + 1, 0, 1);
    } else {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    }
    // if(this.date > new Date()){
    //   this. previusButton = true;
    // }
    this.createDaysArray();
  }


  previusMounth(){
    this.createEventsArray();
    if (this.date.getMonth() == 0) {
      this.date = new Date(this.date.getFullYear() - 1, 11, 1);
    } else {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    }
    this.createDaysArray()
  }

  getMounth(){
    return this.date.getMonth();
  }

  getWeek(){
    return this.date.getDay();
  }

  createDaysArray(){
    let maunthDays = null;
    let M =this.getMounth();
      if (M == 0 ||M == 2 ||M == 4 ||M == 6 ||M == 7 ||M == 9 ||M == 11) maunthDays = 31;
      else if ( M == 3 ||M == 5 ||M == 8 ||M == 10) maunthDays = 30;
      else if (M == 1 ) this.date.getFullYear() % 4 == 0? maunthDays = 29: maunthDays = 28;
    
    this.daysArray = [];
    for(let i = 0; i < maunthDays; i++){
      this.daysArray.push(i+1);
    }
    for(let j = 0; j<this.date.getDay(); j++){
      this.daysArray.unshift(null);
    }
  }
  openEvents(day){
    if(this.eventsArray[day]){
      this.popUp = true;
      setTimeout(()=>{
        this.popupAnimationState = this.cangeableAnimationState;
      }, 10 )
      this.day = day;
      this.week = new Date(this.date.getFullYear(), this.date.getMonth() + 0, day )
      setTimeout(()=>{
        this.heidText = true;
      }, 250)
    }
    
  }
  closeEvents(id){
    this.heidText = false;
    this.popupAnimationState = 'start';
    setTimeout(()=>{
      this.popUp = false;
    }, 200) ;
    
  }

  resize(container){
    if(container > 500){
      this.cangeableAnimationState = 'end';
    }
    else {this.cangeableAnimationState = 'endXs';}
  }


}
