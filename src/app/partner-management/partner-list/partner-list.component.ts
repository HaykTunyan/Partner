// Partner List Component
import { Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { PartnersService } from '../../services/partners/partners.service';
import { Response } from 'selenium-webdriver/http';


const obj = {
  thElm: null,
  startOffset: null
};

// Table header

/**
 * Status
 */
export interface Status {
  value: string;
  viewValue: string;
}

/**
 * Rest
 */
export interface Rest {
  value: string;
  viewValue: string;
}

// Keyword
export interface Keyword {
  name: string;
}

// Product
export interface Product {
  value: string;
  viewValue: string;
}

// Box Categories
export interface boxCategories {
  value: string;
  viewValue: string;
}

/**
 * Area
 */
export interface Area {
  value: string;
  viewValue: string;
}

/**
 * Service
 */
export interface Service {
  value: string;
  viewValue: string;
}

// Component
@Component({
  selector: 'partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})

// export Partner List Component
export class PartnerListComponent implements OnInit {
  partners: any; // partners []
   // Status viewValue.
   statuses = [
    {value: 'status-1', viewValue: 'Enabled'},
    {value: 'status-2', viewValue: 'Disabled'},
    {value: 'status-3', viewValue: 'All'}
  ];
  // Rest viewValue.
  rests = [
    {value: 'rest-1', viewValue: 'Open'},
    {value: 'rest-2', viewValue: 'Closed'},
    {value: 'rest-3', viewValue: 'All'}
  ];
  // Service Type viewValue.
  servicetypes = [
    {value: 'italian-0', viewValue: 'Italian'},
    {value: 'greek-1', viewValue: 'Greek'},
    {value: 'armenian-2', viewValue: 'Armenian'}
  ];
  billingCycle = ['DAY', 'WEEK', 'MONTH', 'ALL'];
  bilingCycleStartDate: any;
  // Keywords.
  selectedAll: any;
  selectedOne: any;
  // keyword
  keywords = [
    {name: 'Pizza'},
  ];
  partnerId: string;
  // partnerListElements
  partnerListElements = [
    {name: 'Partner Name', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Area', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Zone', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Phone Number', checked: false, sort: {name: 'phone', status: ''}},
    {name: 'Order Accep. M.', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Partner Type', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Brand', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Legal Entity', checked: false, sort: {name: 'name', status: ''} },
    {name: 'Service Type', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Partner Category', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Events', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Campaigns', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Billing Cycle N.', checked: true, sort: {name: 'number', status: ''}},
    {name: 'Billing Cycle D/M/W', checked: true, sort: {name: 'date', status: ''}},
    {name: 'Billing cycle S. D.', checked: true, sort: {name: 'data.day', status: ''} },
    {name: 'Contract Number', checked: false, sort: {name: 'number', status: ''}},
    {name: 'Grace Period', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Max Credit Limit', checked: false, sort: {name: 'number', status: ''}},
    {name: 'Order Payment', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Enabled/Disabled ', checked: false, sort: {name: 'name', status: ''}},
    {name: 'Open/Closed', checked: false, sort: {name: 'name', status: ''}}
  ];
  filtrs = {
    id: '', name: '', area: '', zone: '', phone: '', order: '', partnerType: '', breand: '',
    legalEntity: '', serviceType: '', partnerCategory: '', events: '', campaigns: '',
    bilingCycleNumber: '', bilingCycleDate: '', bilingCycleStartDate: '', contractNumber: '',
    gracePeriod: '', maxCreditLimit: '', orderPayment: '', status: '', openOrClose: ''};
  // City aoutocomplete
  brands: string[] = ['Restaurant', 'Shop'];
  partnertypes: string[] = ['Yerevan', 'Yerevan', 'Yerevan'];
  copyPartner = {};
  pageNumber = 0;
  pageSize = 15;
  pages: number;
  // variable for sort kind.
  sortBy: any;
  winHeight = window.innerHeight;
  isNextPartners = false;

  constructor (private partnersService: PartnersService) {}

  ngOnInit() {
    this.getPartnerListByLimitAndFilter();
    this.partnersService.currentId.subscribe(id => this.partnerId = id);
    setTimeout(() => {
    });
  }

  keyDown(event, status: string, type: string) {
    if (event.keyCode === 8) {
      this.filtrs[status] = '';
      if(type === 'selectOption'){
        this.getPartnerFilter();
      }
    } else {
      return false;
    }
  }

  // function for create sort params and send back end.
  sortButton(index) {
    if (!this.partnerListElements[index].sort.status) {
      this.partnerListElements[index].sort.status = 'asc';
    } else if (this.partnerListElements[index].sort.status === 'asc') {
      this.partnerListElements[index].sort.status = 'desc';
    } else {
      this.partnerListElements[index].sort.status = 'asc';
    }
    for (let i = 0; i < this.partnerListElements.length; i++) {
      if (i !== index) {
        this.partnerListElements[i].sort.status = '';
      }
    }
    this.sortBy = this.partnerListElements[index].sort;
    this.pageNumber = 0;
    this.getPartnerListByLimitAndFilter()
  }

  // remove keyword
  remove(keyword): void {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  //select all checkbox
  selectAll() {
    this.partners.forEach(item => {
      item.checked = this.selectedAll;
    });
  }

  //check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.partners.every(item => {
      return item.checked === true;
    });
  }

  //check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.partners.filter(item => {
      return item.checked === true;
    });
  }

  //get all Partners
  getAllPartner() {
    this.partnersService.getAllPartner()
    .subscribe(
      response => {
        if (response) {
          this.partners = response;
        }
      });
  }

  editPartner(id) {
    this.partnerId = id;
    this.partnersService.changeId(this.partnerId);
  }

  copyPartnerById(id) {
    this.partnersService.getPartnerById(id).subscribe(res => {
      if (res) {
        const data = res;
        delete data.id;
        data.name = `${data.name}copy`;
        this.copyPartner = data;
        this.partnersService.addPartner(this.copyPartner).subscribe(res => {
         if (res) {
           this.getAllPartner();
         }
        });
      }
    });
  }

  onScroll (scroll, elem) {
    if(elem.clientHeight-this.winHeight<scroll && this.isNextPartners){
      this.getPartnerListByLimitAndFilter();
      this.isNextPartners = false;
    }
  }

  getPartnerListByLimitAndFilter(){
    this.partnersService.getPartnerFilter(this.pageNumber, this.pageSize, this.filtrs, this.sortBy)
    .subscribe(data =>{
      const partners = data.content;
      console.log(data);
      !this.pageNumber ? this.partners = partners: this.partners = this.partners.concat(partners);
      this.pageNumber ++;
      this.isNextPartners = !!partners[this.pageSize-1]
      console.log(this.isNextPartners);
    }, error => {

    });
  }

  numberKeypress(event){
    if(isNaN(+event.key) || event.charCode === 32){
      return false;
    }
  }
  selectChangeValue(status: string, event) {
    const value = event.value
    if(value === 'ALL') {
      this.filtrs[status] = '';
    } else {
      this.filtrs[status] = value;
    }
  }

  deleteDate(event) {
    if (event.keyCode === 8) {
      this.bilingCycleStartDate = new FormControl(null);
      this.getDate(null);
    } else {
      return false;
    }
  }

  getDate(date) {
    if(date) {
      const newDate = JSON.stringify(date);
      this.filtrs.bilingCycleStartDate = newDate;
    } else {
      this.filtrs.bilingCycleStartDate = '';
    }
    this.getPartnerFilter();
  }

  getPartnerFilter() {
    this.pageNumber  = 0;
    this.getPartnerListByLimitAndFilter();
    console.log(this.filtrs);
  }
}
