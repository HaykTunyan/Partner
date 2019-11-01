import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  dates: Date [] = [];
  mounthsDays: Date [] = [];
  freeDays: any [] = []
  date = new Date(new Date().getFullYear(), new Date().getMonth());
  previusButton = false;
  daysArray: any [];
  weeknames = ['SUN', 'MON', 'TUE', 'WEB', 'THU', 'FRI', 'SAT'];
  popupAnimationState = 'start';
  day = 0;
  week: Date;
  heidText = false;
  cangeableAnimationState = 'end';
  firstTime = false;
  secondTime = false;
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  IsEdit = true;

  constructor(private service: CalendarService) { }

  ngOnInit() {
     this.createDaysArray();
     this.getMounthFreeDays();
  }

  getMounthFreeDays () {
    this.mounthsDays = [];
    this.freeDays = [];
    for (let i = 0; i < this.dates.length; i++) {
      if(this.date.getFullYear() === this.dates[i].getFullYear()){
        if(this.date.getMonth() === this.dates[i].getMonth()) {
          this.mounthsDays.push(this.dates[i]);
          this.freeDays.push(this.dates[i].getDate());
        }
      }
    }
  }
  nextMounth(){
    if (this.date.getMonth() == 11) {
      this.date = new Date(this.date.getFullYear() + 1, 0, 1);
    } else {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
    }
    if(this.date > new Date()){
      this. previusButton = true;
    }
    this.getMounthFreeDays();
    this.createDaysArray();
  }


  previusMounth(){
    if (this.date.getMonth() == 0) {
      this.date = new Date(this.date.getFullYear() - 1, 11, 1);
    } else {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
    }
    if(this.date <= new Date()){
      this. previusButton = false;
    }
    this.getMounthFreeDays();
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
    let M = this.getMounth();
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
  openEvents(date: string){
    const newDate = new Date(this.date.getFullYear(), this.date.getMonth(), +date);
    if(!this.checkedIsSelektedDate(newDate)){
      this.dates.push(newDate);
      this.mounthsDays.push(newDate);
      this.freeDays.push(newDate.getDate());
    }
  }
// chacks is such date in dates array? 
  checkedIsSelektedDate(date: Date) {
    for(let i=0; i< this.mounthsDays.length; i++){
      if (date.getDate() === this.mounthsDays[i].getDate()) {
        i = Infinity;
        return true;
      }
    }
    return false;
  }
  deleteDay(event, day: string) {
    event.stopPropagation();
    for(let i = 0; i< this.dates.length; i++){
      if(this.dates[i].getFullYear() === this.date.getFullYear()) {
        if (this.dates[i].getMonth() === this.date.getMonth()) {
          if(this.dates[i].getDate() === +day) {
            this.dates.splice(i, 1);
            this.getMounthFreeDays();
          }
        }
      }
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

