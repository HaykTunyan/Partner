import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CampaignManagementService} from '../../../services/campaign-management/campaign-management.service';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';


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
  selector: 'app-gifts-inventory',
  templateUrl: './gifts-inventory.component.html',
  styleUrls: ['./gifts-inventory.component.scss']
})
export class GiftsInventoryComponent implements OnInit {

  filterText;
  gifts: any = [];
  date1 = new FormControl(moment()); // form for start time material input.
  date = new FormControl(null);
  selectedAll: any;
  selectedOne: any;
  // giftListElements
  giftListElements = [
    {name: 'S/N', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Gift Name', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Item Condition', checked: true, sort: {name: 'condition', status: ''}},
    {name: 'Used', checked: true, sort: {name: 'used', status: ''}},
    {name: 'Date', checked: true, sort: {name: 'date', status: ''}},
    {name: 'Quantity', checked: true, sort: {name: 'quantity', status: ''}},
  ];
  page = 0; // pagination page value.
  sorting: any;
  startDateFilter: any;
  giftNameFilter = '';
  giftConditionFilter = '';
  giftUsedFilter = '';
  giftQuantityFilter = '';
  giftSNIdFilter = ''
  timeout; // variable which contains timeOut function for typing input filter.
  scrollData = {
    scroll: 0,
    height: 0
  }; // scroll and height data for table component.
  getNext20Campaign = true; // is backup data done or not
  windowHeight = window.innerHeight; // window height


  constructor(private campaignManagementService: CampaignManagementService) {
  }


  ngOnInit() {
    this.getAllGiftsByLimit();
  }


  conditions = ['condition 1', 'condition 2', 'condition 3'];

  //select all checkbox
  selectAll() {
    this.gifts.forEach(item => {
      item.checked = this.selectedAll;
    });
  }

  //check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.gifts.every(item => {
      return item.checked === true;
    });
  }

  //check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.gifts.filter(item => {
      return item.checked === true;
    });
  }

  keyDownCampaignInput(event, type) {
    if (event.keyCode === 8) {
      this.giftConditionFilter = '';
      this[type] = '';
      this.filter();
    } else {
      return false;
    }
  }
  sortButton(index) {
    if (!this.giftListElements[index].sort.status) {
      this.giftListElements[index].sort.status = 'asc';
    } else if (this.giftListElements[index].sort.status === 'asc') {
      this.giftListElements[index].sort.status = 'desc';
    } else {
      this.giftListElements[index].sort.status = 'asc';
    }
    for (let i = 0; i < this.giftListElements.length; i++) {
      if (i !== index) {
        this.giftListElements[i].sort.status = '';
      }
    }
    // this.isFilterStart = true;
    // this.sortBy = this.giftListElements[index].sort;
    // this.paginationCount = 0;
  }

  // function for clear filter date input.
  deleteDate(event) {
    if (event.keyCode === 8) {
      this.startDateFilter = '';
      this.date1 = new FormControl(null);
      this.filter()
    } else {
      return false;
    }
  }

  // to correcting date to send server for filter and  send server
  getDate(event, status) {

    let year, month, day;;
    this[status] = event.value;
    year = this[status].getFullYear();
    month = this[status].getMonth() + 1;
    day = this[status].getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    if (status === 'startDateFilter') {
      this.startDateFilter = month + '/' + day + '/' + year;
       this.filter();
    }

    if (event.value) {
      // this.parseDateJsonFormatStart();
    }
  }


  getAllGiftsByLimit() {
    this.campaignManagementService.get_all_gifts_by_limit(0, 20).subscribe(response => {

      this.gifts = response;

      this.gifts.forEach(item => {

        item.checked = false;
      });

    });
  }

  getCampaignGiftsListByFilter() {

    const filterDate = {
      giftName: this.giftNameFilter,
      giftCondition: this.giftConditionFilter,
      giftUsed: this.giftUsedFilter,
      giftDate: this.startDateFilter,
      quantity: this.giftQuantityFilter,
      id: this.giftSNIdFilter
    };

    this.campaignManagementService.getCampaignGiftsListByFilter(this.page, filterDate, this.sorting).subscribe(response => {

      if (response['content']) {
        const newData = response['content'];
        if (!this.page) {
          this.gifts = [];
        }
        this.gifts = this.gifts.concat(newData);
        if (newData[19]) {
          this.getNext20Campaign = true;
          this.page++;
        } else {
           this.getNext20Campaign = false;
        }
      }


    });

  }

  // writes in input filter and gets new date.
  writeInFilterInputs(type, value) {
    const goFilter = this.ignoreSpace(value, type);
    if (goFilter) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {

        this[type] = value;
        this.filter();
      }, 1000);
    }
  }

  // ignore space begin and end string.
  ignoreSpace(value, name) {
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
      status = 'end';
      for (let i = string.length - 1; i >= 0; i--) {
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
    this.filter[name] = string1;
    if (isValue === 1) {
      return string1;
    } else if (!isValue) {
      return true;
    } else if (isValue === 3) {
      return false;
    }
  }

  // begins implementation of any filter.
  filter() {
    this.page = 0;
    this.getCampaignGiftsListByFilter();
  }

  // gets the height of all content, and scroll top during scrolling.
  scroll(scroll, height) {
    this.scrollData = {
      scroll,
      height
    };

    if (this.scrollData.scroll > this.scrollData.height - this.windowHeight) {
      if (this.getNext20Campaign) {
        this.getNext20Campaign = false;
        this.getCampaignGiftsListByFilter();
      }
    }
  }
}
