import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FlowSettingsService} from '../../../services/settings/flow-settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-flow-table',
  templateUrl: './flow-table.component.html',
  styleUrls: ['./flow-table.component.scss']
})
export class FlowTableComponent implements OnInit, OnChanges {
  dataList: any = [];  // backup data.
  filterName = '';
  windowHeight = window.innerHeight; // window height
  getNext20Data = false; // is backup data done or not
  listElements = [
    {name: 'Status Name', sort: {name: 'statuses.name', status: ''}},
    {name: 'Warning After', sort: {name: 'warningTime', status: ''}},
    {name: 'Alert After', sort: {name: 'alertTime', status: ''}},
    {name: 'Cancel After', sort: {name: 'cancelTime', status: ''}}
  ]; // backup table names and sorts.
  page = 0; // pagination page value.
  timeout; // variable which contains timeOut function for typing input filter.
  sorting: any; // sort name and status for send to backend.
  creatableData: any = {
    id: 0,
    warningTime: '',
    warningStatus: false,
    alertTime: '',
    alertStatus: false,
    cancelTime: '',
    cancelStatus: false,
    statuses: []
  }; // variable for create or change status in table.
  changeableData: any = {
    id: 0,
    warningTime: '',
    warningStatus: false,
    alertTime: '',
    alertStatus: false,
    cancelTime: '',
    cancelStatus: false,
    acceptableStatus: {
      id: 0,
      name: ''
    },
  }; // variable for create or change status in table.
  variableForClearChangeableDate = {
    id: 0,
    warningTime: '',
    warningStatus: false,
    alertTime: '',
    alertStatus: false,
    cancelTime: '',
    cancelStatus: false,
    statuses: []
  }; // variable to clear changeable status in table.
  statusesString = ''; // variable for status name.
  popupStatus = ''; // popup status: change or create.
  changeableItemIndex = 0; // changeable status index from table.
  isSelectOpen = false; // open or close select option.
  statuses: any = []; // status data from backend.
  statusChecked: any = []; // array for statuses checkbox in popup.
  chaneClosePopup = true; // variable for close popup in time click other sites popup.
  @Input() scrollData; // scroll data from parent component.
  IsEdit = false;

  constructor(private flowData: FlowSettingsService, private router: Router) { }
  ngOnInit() {
    this.getDataFilter();
    this.getAcceptableStatus();
  }
  // log out function.
  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }
  // gets scroll params from parent component.
  ngOnChanges(changes: SimpleChanges) {
    if (this.scrollData.scroll > this.scrollData.height - this.windowHeight) {
      if (this.getNext20Data) {
        if (this.getNext20Data) {
          this.getDataFilter();
        }
        this.getNext20Data = false;
      }
    }
  }
  // gets data for table from filter.
  getDataFilter() {
    this.flowData.getAcceptableStatusDelays( this.page, 20, this.filterName, this.sorting).subscribe(data => {
      const newData = data['content'];
      if (this.page === 0) {
        this.dataList = [];
      }
      this.dataList = this.dataList.concat(newData);
      if (newData[19]) {
        this.page++;
        this.getNext20Data = true;
      } else {
        this.getNext20Data = false;
      }
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // gets acceptable status from backend.
  getAcceptableStatus() {
    this.flowData.getAcceptableStatus().subscribe(data => {
      this.statuses = data;
      this.generateCheckboxArray();
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // writes in filter inputs.
  writeInFilterInputs(value) {
    const goFilter = this.ignoreSpace (value);
    if (goFilter) {
      this.page = 0;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getDataFilter();
      }, 1000);
    }
  }
  // ignore space begin and end string.
  ignoreSpace (value) {
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
    this.filterName = string1;
    if (isValue === 1) {
      return string1;
    } else if (!isValue) {
      return true;
    } else if (isValue === 3) {
      return false;
    }
  }
  // push and implementation of sort buttons.
  sortButton(index) {
    for (let i = 0; i < this.listElements.length; i++) {
      if (i !== index) {
        this.listElements[i].sort.status = '';
      }
    }
    this.listElements[index].sort.status === 'asc' ?
      this.listElements[index].sort.status = 'desc' :
      this.listElements[index].sort.status = 'asc';
    this.dataList = [];
    this.page = 0;
    this.sorting = this.listElements[index].sort;
    this.getDataFilter();
  }
  // int number validation for inputs.
  numberValidation (event, status) {
    if (this.popupStatus === 'change') {
      if (isNaN(+(+this.creatableData[status] + event.key)) || event.charCode === 32 || isNaN(+event.key)) {
        return false;
      }
    } else if (this.popupStatus === 'create') {
      if (isNaN(+(+this.creatableData[status] + event.key)) || event.charCode === 32 || isNaN(+event.key)) {
        return false;
      }
    }
  }
  // changes function for status from table.
  change(i) {
    this.changeableItemIndex = i;
    this.changeableData = JSON.parse(JSON.stringify(this.dataList[this.changeableItemIndex]));
    // console.log(this.changeableData);
    this.popupStatus = 'change';
    this.changeStatusFromChangeableStatus();
  }
  // creates new status into table.
  create() {
    this.popupStatus = 'create';
    this.generateCheckboxArray();
  }
  // opens select option for create or change status from table.
  openSelectOption() {
    this.isSelectOpen = !this.isSelectOpen;
  }
  // generate checkbox array for status in popup in time edit status.
  changeStatusFromChangeableStatus() {
    this.statusChecked = [];
    this.statusesString = '';
    for (let i = 0; i < this.statuses.length; i++) {
      if (this.changeableData.acceptableStatus.id === this.statuses[i].id) {
        this.statusChecked.push(true);
        this.statusesString = this.changeableData.acceptableStatus.name;
      } else {
        this.statusChecked.push(false);
      }
    }
  }
  // generates checkbox array for status in popup in time create.
  generateCheckboxArray() {
    this.statusChecked = [];
    this.statusesString = '';
    for (let i = 0; i < this.statuses.length; i++) {
      for (let j = 0; j < this.creatableData.statuses.length; j++) {
        if (this.statuses[i].id === this.creatableData.statuses[j].id) {
          this.statusChecked.push(true);
          if (j === 0) {
            this.statusesString = this.creatableData.statuses[j].name;
          } else {
            this.statusesString += ', ' + this.creatableData.statuses[j].name;
            }
          }
        }
      if (!this.statusChecked[i]) {
        this.statusChecked.push(false);
      }
    }
  }
  // click on checkbox status in popup select option.
  clickToCheckboxStatus(i, id, name) {
    if (this.popupStatus === 'create') {
      if (this.statusChecked[i]) {
        this.creatableData.statuses.push(this.statuses[i]);
      } else {
        for (let k = 0; k < this.creatableData.statuses.length; k++) {
          if (this.creatableData.statuses[k].id === id) {
            this.creatableData.statuses.splice(k, 1);
            k = Infinity;
          }
        }
      }
    } else if (this.popupStatus === 'change') {
      this.changeableData.acceptableStatus.id = id;
      this.changeableData.acceptableStatus.name = name;
      this.statusChecked = [];
      for (let k = 0; k < this.statuses.length; k++) {
        if (id === this.statuses[k].id) {
          this.statusChecked.push(true);
        } else {
          this.statusChecked.push(false);
        }
      }
    }
     this.makeStatusString();
  }
  // joins status names in one line.
  makeStatusString() {
    this.statusesString = '';
    if (this.popupStatus === 'create') {
      for (let j = 0; j < this.creatableData.statuses.length; j++) {
        if (j === 0) {
          this.statusesString = this.creatableData.statuses[j].name;
        } else {
          this.statusesString += ', ' + this.creatableData.statuses[j].name;
        }
      }
    } else if (this.popupStatus === 'change') {
      this.statusesString = this.changeableData.acceptableStatus.name;
    }
  }
  // clears all statuses in input in popup.
  clearStatuses() {
    this.statusesString = '';
    this.creatableData.statuses = [];
    this.generateCheckboxArray();
  }
  // cancels the status creation or edit popup.
  cancel() {
    if (this.popupStatus === 'create') {
      this.creatableData = JSON.parse(JSON.stringify(this.variableForClearChangeableDate));
    } else if (this.popupStatus === 'change') {
      this.changeableData = JSON.parse(JSON.stringify(this.variableForClearChangeableDate));
    }
    this.popupStatus = '';
  }
  // save button function in the status creation or edit popup.
  save() {
    if (this.popupStatus === 'change') {
      const body = JSON.parse(JSON.stringify(this.changeableData));
      this.dataList[this.changeableItemIndex] = body;
      this.flowData.changeStatus(body).subscribe(data => {
      }, error => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      });
    } else if (this.popupStatus === 'create') {
      const body = JSON.parse(JSON.stringify(this.creatableData));
      this.page = 0;
      this.flowData.saveStatus(body).subscribe(data => {
      this.getDataFilter();
      }, error => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      });
    }
    this.cancel();
  }
  // forbids to close any popup.
  dontClosePopup() {
    this.chaneClosePopup = false;
  }
  // allows to close popup.
  closePopup() {
    this.chaneClosePopup = true;
  }
  // closes popup when click outside popup.
  clickOutsidePopup() {
      if (this.chaneClosePopup) {
        this.cancel();
      }
  }
}
