import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BackupService} from '../../../services/settings/backup.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-backup-table',
  templateUrl: './backup-table.component.html',
  styleUrls: ['./backup-table.component.scss']
})
export class BackupTableComponent implements OnInit, OnChanges {
  backupList: any = [];  // backup data.
  backupListElements = [
    {name: 'Backup Name', sort: {name: 'name', status: ''}},
    {name: 'Date', sort: {name: 'backupDate', status: ''}},
    {name: 'Time', sort: {name: 'backupTime', status: ''}},
    {name: 'Type', sort: {name: 'type', status: ''}},
    {name: 'Size', sort: {name: 'fileSize', status: ''}},
  ]; // backup table names and sorts.
  // Variables for filter inputs.
  name = '';
  filterDate: any;
  typeFilterValue = '';
  timeValue = '';
  size = '';
  // variables for types selectOption and filter.
  typesArray = ['Manually', 'Automatically'];
  typesName = {AUTOMATICALLY: 'Automatically', MANUALLY: 'Manually'};
  typesKey = {Automatically: 'AUTOMATICALLY', Manually: 'MANUALLY'};
  isTypeFilterSelectOptionOpen = false;
  windowHeight = window.innerHeight; // window height
  getNext20Backups = false; // is backup data done or not
  sorting: any;
  page = 0; // pagination page value.
  timeout; // variable which contains timeOut function for typing input filter.
  @Input() scrollData; // scroll data from parent component.

  constructor(private backupData: BackupService,  private router: Router) {}
  ngOnInit() {
    this.getBackupDataFilter();
  }
  // log out function.
  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }
  // gets scroll params from parent component.
  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollData.scroll > this.scrollData.height - this.windowHeight) {
      if (this.getNext20Backups) {
        this.getNext20Backups = false;
        this.getBackupDataFilter();
      }
    }
  }
  // gets backup date filter.
  getBackupDataFilter() {
    const filterDate = {
      name: this.name,
      date: this.changeDateFormatForFilter(this.filterDate),
      time: this.timeValue,
      type: this.typeFilterValue ? this.typesKey[this.typeFilterValue] : '',
      size: this.size
    };
    this.backupData.getBackupListWhitFilter(this.page, filterDate, this.sorting).subscribe(data => {
      if (data['content']) {
        const newData = data['content'];
        if (!this.page) {
          this.backupList = [];
        }
        this.backupList = this.backupList.concat(newData);
        if (newData[19]) {
          this.getNext20Backups = true;
          this.page++;
        } else {
          this.getNext20Backups = false;
        }
      }
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // changes date format for filter.
  changeDateFormatForFilter(date) {
    let newDate = '';
    console.log(date);
    if (date) {
      if (!date.pristine) {
        newDate += date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      }
    }
    return newDate;
  }
  // gets gate from date input.
  getDate(event, status) {
    this[status] = event.value['_d'];
    this.filter();
  }
  // key press validation for material data picker.
  keyDownDateInput(event, status) {
    if (event.keyCode === 8) {
      this[status] = new FormControl(null);
      this.filter();
    } else {
      return false;
    }
  }
  // writes in input filter and gets new date.
  writeInFilterInputs(name, value) {
    const goFilter = this.ignoreSpace (value, name);
    if (goFilter) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.filter();
        console.log('filter');
      }, 1000);
    }
  }
  // clears type filter input.
  clearTypeFilter(event) {
    if (event.keyCode === 8) {
      this.typeFilterValue = '';
      this.filter();
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // opens type select option.
  openTypesSelectOption() {
    this.isTypeFilterSelectOptionOpen = true;
  }
  // selects type.
  selectType(type) {
    this.typeFilterValue = type;
    this.isTypeFilterSelectOptionOpen = false;
    this.filter();
  }
  // closes type select option.
  closeTypeSelectOption() {
    this.isTypeFilterSelectOptionOpen = false;
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
      this.filter();
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // changes time in input to time format.
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
      this.filter();
    }
  }
  // begins implementation of any filter.
  filter() {
    this.page = 0;
    this.getBackupDataFilter();
  }
  // push and implementation of sort buttons.
  sortButton(index) {
    for (let i = 0; i < this.backupListElements.length; i++) {
      if (i !== index) {
        this.backupListElements[i].sort.status = '';
      }
    }
    this.backupListElements[index].sort.status === 'asc' ?
      this.backupListElements[index].sort.status = 'desc' :
      this.backupListElements[index].sort.status = 'asc';
    this.backupList = [];
    this.page = 0;
    this.sorting = this.backupListElements[index].sort;
    this.getBackupDataFilter();
  }
  // ignore space begin and end string.
  ignoreSpace (value, name) {
    let string = '', status = 'start', string1 = '', isValue = 0;
    if (value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== ' ' && status === 'start') {
          string += value[i];
          status = 'middle';
        } else if (status === 'middle') {
          string += value[i];
        }
        isValue = 1;
      }
      status = 'end'
      for (let i = string.length - 1; i >= 0; i-- ) {
        if (string[i] !== ' ' && status === 'end') {
          string1 = string[i] + string1;
          status = 'middle';
        } else if (status === 'middle') {
          string1 = string[i] + string1;
        } else {
          isValue = 3;
        }
      }
    }
    this[name] = string1;
    if (isValue === 1) {
      return string1;
    } else if (!isValue) {
      return true;
    } else if (isValue === 3) {
      return false;
    }
  }
}
