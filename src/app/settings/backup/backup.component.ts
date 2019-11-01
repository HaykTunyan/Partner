import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {BackupService} from '../../services/settings/backup.service';

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
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss'],  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class BackupComponent implements OnInit {
  date = new FormControl(moment());
  backupRepeatArray = [
    {
      name: 'Monthly',
      checked: true
    }, {
      name: 'Weekly',
      checked: false
    }, {
      name: 'Daily',
      checked: false
    }, {
      name: 'Hourly',
      checked: false
    }
  ]; // array of backup period checkboxes.
  timePeriodIndex = 0; // checked time period index.
  backupTimeSortNames = {
    MONTHLY: 'Monthly',
    WEEKLY: 'Weekly',
    DAILY: 'Daily',
    HOURLY: 'Hourly',
    Hourly: 'HOURLY',
    Daily: 'DAILY',
    Weekly: 'WEEKLY',
    Monthly: 'MONTHLY'
  }; // variable for difference between front and beck time periods.
  startDate: any; // start date input value
  timeValue = ''; // time input value
  time = false; // is time input selected or not.
  hourValue = ''; // hourly part's hour input value.
  hour = false; // is hour input selected or not.
  minuteValue = ''; // hourly part's minute input value.
  minute = false; // is minute input selected or not.
  hourlyBlock = false; // is hourly additional box open or close.
  zipRadiobuttonArray = [
    {
      name: 'Zip',
      checked: true
    }, {
      name: 'Non Zip',
      checked: false
    }]; // array of checkboxes of zip or non zip backups.

  oldBackupTimesArray: any = []; // backup times from back end.
  scrollData = {
    scroll: 0,
    height: 0
  }; // scroll and height data for table component.
  IsEdit = true;

  constructor( private backupData: BackupService,  private router: Router) { }

  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
    this.getBackupDatesArray();
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
  //  clicking of backup time period checkbox.
  backupRadioClick(index) {
    for (let i = 0; i < this.backupRepeatArray.length; i++) {
      this.backupRepeatArray[i].checked = false;
    }
    this.backupRepeatArray[index].checked = true;
    this.openOrCloseBackupHourly();
    this.timePeriodIndex = index;
  }
  // key press validation for material data picker.
  keyDownDateInput(event, status) {
    if (event.keyCode === 8) {
        this[status] =  new FormControl(null);
    } else {
      return false;
    }
  }
  // get date from backup time input.
  getDate (event, status) {
   this[status] = event.value['_d'];
  }
  // function for border style of time inputs when you focus on it.
  focusFunction(status) {
    this[status] = true;
  }
  // function for border style of time inputs when you leave it.
  focusOutFunction(status) {
    this[status] = false;
      if (status === 'time' && this.timeValue.length < 5) {
        this.timeValue = '00:00';
      } else if (status === 'hour' ) {
        if (!this.hourValue) {
          this.hourValue = '00';
        } else if (this.hourValue.length === 1) {
          this.hourValue = '0' + this.hourValue;
        }
      } else if (status === 'minute') {
        if (!this.minuteValue) {
          this.minuteValue = '00';
        } else if (this.minuteValue.length === 1) {
          this.minuteValue = '0' + this.minuteValue;
        }
      }
  }
  // time inputs keypress validation.
  timeValidation(event, value) {
    this.timeValue = value;
    if (isNaN(+event.key) || event.charCode === 32) {
      return false;
    }
    if (this.timeValue.length > 4) {
      return false;
    }
  }
  // clear keypress validation for time inputs.
  clearTimeDada(event) {
    if (event.keyCode === 8) {
      this.timeValue = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // change time to correct format in backup time input.
  changeTimeFormat(value) {
    this.timeValue = value;
    if (value.length === 2) {
      if (value * 1 > 23) {
        this.timeValue = '23';
      }
      this.timeValue += ':';
    } else if (value.length === 5) {
      let string = value;
      const minutes = (string[3] + string[4] * 1);
      if (minutes > 59) {
        string = string[0] + string[1] + ':59';
        this.timeValue = string;
      }
    }
  }
  // keypress validation on minute and hour.
  hourEndMinuteKeypressValidation(event, status, value) {
    this[status] = value;
    if (isNaN(+event.key) || event.charCode === 32) {
      return false;
    }
    if (this[status].length > 1) {
      return false;
    }
  }
  // hour or minute clear key validation.
  clearMinuteOrHour(event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // change minute or hour forms
  changeMinuteOrHourForm(status, value) {
    this[status] = value;
    if (status === 'hourValue') {
      if (+value > 23) {
        this.hourValue = '23';
      }
    } else if (status === 'minuteValue') {
      if (+value > 59) {
        this.minuteValue = '59';
      }
    }
  }
  // click on zip or non zip radiobuttons.
  zipRadioClick(index) {
    this.zipRadiobuttonArray[0].checked = false;
    this.zipRadiobuttonArray[1].checked = false;
    this.zipRadiobuttonArray[index].checked = true;
  }
  // open or close hourly additional space.
  openOrCloseBackupHourly() {
    if (this.backupRepeatArray[3].checked) {
      this.hourlyBlock = true;
    } else {
      this.hourlyBlock = false;
    }
  }
  // deletes old backup time.
  deleteBackupTime(index) {
    this.oldBackupTimesArray.splice(index, 1);
  }
// adds backup time
  addBackupTime() {
    if (this.startDate) {
      if (!this.startDate.status) {
        let changedDate: any
        if (this.timeValue) {
          const h = +(this.timeValue[0] + this.timeValue[1]);
          const m = +(this.timeValue[3] + this.timeValue[4]);
          changedDate = new Date(Date.UTC(
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate(), h, m));
        } else {
          changedDate = new Date(Date.UTC(
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate(), 0, 0));
        }
        changedDate = JSON.parse(JSON.stringify(changedDate));
        changedDate = changedDate.split('.000Z')[0];
        if (!+this.hourValue && !+this.minuteValue) {
          this.hourValue = '01';
        }
        const timePeriod = this.backupTimeSortNames[this.backupRepeatArray[this.timePeriodIndex].name];
        this.oldBackupTimesArray.push({
          'hour': this.hourValue ? this.hourValue : '00',
          'minute': this.minuteValue ? this.minuteValue : '00',
          'backupPackaging': this.zipRadiobuttonArray[0].checked ? 'ZIP' : 'NON_ZIP',
          'startDateTime': changedDate,
          'backupTimePeriod': timePeriod
        });
        this.clearNewBackupInputs();
      }
    }

  }
  // clears backup inputs.
  clearNewBackupInputs() {
    this.backupRadioClick(0);
    this.timeValue = '';
    this.startDate =  new FormControl(null);
    this.hourValue = '';
    this.minuteValue = '';
    this.zipRadiobuttonArray[0].checked = true;
    this.zipRadiobuttonArray[1].checked = false;
  }
  // gets backup saved date from back end.
  getBackupDatesArray() {
    this.backupData.getBackupTimesArray().subscribe(data => {
      this.oldBackupTimesArray = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // cancels view changes in backup part.
  cancel() {
    this.getBackupDatesArray();
    this.clearNewBackupInputs();
  }
  // save backup changes in back end.
  save() {
    this.addBackupTime();
    this.backupData.sendNewBackupDates(this.oldBackupTimesArray).subscribe(data => {
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // backup now.
  backupNow() {

  }
  // gets the height of all content, and scroll top during scrolling.
  scroll(scroll, height) {
    this.scrollData = {
      scroll,
      height
    };
  }
}
