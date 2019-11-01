import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'working-time',
  templateUrl: './working-time.component.html',
  styleUrls: ['./working-time.component.scss']
})

export class WorkingTimeComponent implements OnInit {
  weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  timeInputsFocus = [{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  },{
    firstTime: false, secondTime: false
  }];
  timesArray = [{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  },{
    'firstTimeValue': '', 'secondTimeValue': ''
  }];
  IsEdit = true;
constructor(){}

ngOnInit() {}

// function for border style of time inputs in time focus.
focusFunction(status: string, index: number) {
  this.timeInputsFocus[index][status] = true;
}
// function for border style of time inputs in time leave.
focusOutFunction(status: string, index: number) {
  this.timeInputsFocus[index][status] = false;
  if (status === 'firstTime') {
    if (this.timesArray[index].firstTimeValue.length < 5) {
      this.timesArray[index].firstTimeValue = '00:00';
    }
  } else if (status === 'secondTime') {
    if (this.timesArray[index].secondTimeValue.length < 5) {
      this.timesArray[index].secondTimeValue = '00:00';
    }
  }
}
// time inputs keypress validation.
timeValidation(event, value, status, index) {
  this.timesArray[index][status] = value;
  if (isNaN(+event.key) || event.charCode === 32) {
    return false;
  }
  if (this.timesArray[index][status].length > 4) {
    return false;
  }
}
// clear keypress validation for time inputs.
clearTimeDada(event, status, index) {
  if (event.keyCode === 8) {
    this.timesArray[index][status] = '';
  } else if (event.keyCode === 46) {
    return false;
  }
}
// change time format to correct format.
changeTimeFormat(value, status, index) {
  this.timesArray[index][status] = value;
  if (value.length === 2 ) {
    if ( value * 1 > 23) {
      this.timesArray[index][status] = '23';
    }
    this.timesArray[index][status] += ':';
  } else if (value.length === 5) {
    let string = value;
    const minutes = (string[3] + string[4] * 1);
    if (minutes > 59) {
      string = string[0] + string[1] + ':59';
      this.timesArray[index][status] = string;
    }
  }
}
}
