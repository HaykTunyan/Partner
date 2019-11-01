import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {UserManagementService} from '../../../services/user-management/user-management.service';
import {CampaignManagementService,} from '../../../services/campaign-management/campaign-management.service';
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
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

  url = this.campaignManagementService.baseUrl;
  allCampaigns: any = [];
  text;
  campaignType = [
    {value: 'DISCOUNT', viewValue: 'Discount or Delivery fee campaign'},
    {value: 'COMBO_SET', viewValue: 'Combo-Set Campaign'},
    {value: 'BONUS', viewValue: 'Bonus'},
    {value: 'FREE_ITEM', viewValue: 'Free Item'},
    {value: 'SPONSORED_PARTNER_ITEMS', viewValue: 'Sponsored Partner Items'},
    {value: 'VOUCHER', viewValue: 'Voucher'},
    {value: 'OUT_OF_SCHEDULE', viewValue: 'Out of Schedule Items'},
    {value: 'PROMO_CODE', viewValue: 'Promo Code'},
  ];
  page = 0; // pagination page value.
  timeout; // variable which contains timeOut function for typing input filter.
  windowHeight = window.innerHeight; // window height
  getNext20Campaign = true; // is backup data done or not
  scrollData = {
    scroll: 0,
    height: 0
  }; // scroll and height data for table component.
  selectedOne: any;
  selectedAll: any;
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.

  // campaignElements
  campaignElements = [
    {name: 'Campaign Name', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Campaign Type', checked: true, sort: {name: 'campaignType', status: ''}},
    {name: 'Start Date', checked: true, sort: {name: 'startDate', status: ''}},
    {name: 'End Date', checked: true, sort: {name: 'endDate', status: ''}},
    {name: 'Description', checked: true, sort: {name: 'description', status: ''}},
  ];
  isCampaignTypeSelectOptionOpen = false;
  campaignTypeInputValue = '';


  rolesCreateSelect = false;
  isFilterStart = false;

  // filter inputs values.
  campaignIdFilter = '';
  campaignNameFilter = '';
  campaignTypeFilter = '';
  startDateFilter: any;
  endDateFilter: any;
  descriptionFilter = '';

  // variable for sort kind.
  sortBy;
  invitationOrResend = 'false';
  // allCampaigns data from back end.
  data: any;
  @ViewChild('content') content: ElementRef;
  contentHeight;
  getNewallCampaigns = true;
  paginationCount = 0;
  serverError = false;
  campaignForCopy: any;
  randomGenerateNameValue = '';

  // filter date clear variable.


  constructor(
    private userManagement: UserManagementService,
    private campaignManagementService: CampaignManagementService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getAllCampaignByLimit();
    this.campaignManagementService.changeCampaignTypeStatus = false;
  }

  // get 20 allCampaigns from beck end.
  getCampaignListByFilter() {
    const filterDate = {
      id: this.campaignIdFilter,
      campaignName: this.campaignNameFilter,
      campaignType: this.campaignTypeFilter,
      description: this.descriptionFilter,
      startDate: this.startDateFilter,
      endDate: this.endDateFilter
    };

    this.campaignManagementService.getCampaignListByFilter(this.page, filterDate, this.sortBy).subscribe(response => {

      if (response['content']) {
        const newData = response['content'];
        if (!this.page) {
          this.allCampaigns = [];
        }

        this.allCampaigns = this.allCampaigns.concat(newData);
        if (newData[19]) {
          this.getNext20Campaign = true;
          this.page++;
        } else {
          this.getNext20Campaign = false;
        }
      }

      this.allCampaigns.forEach(item => {
        item.checked = false;
        if (item['campaignType'] == 'DISCOUNT') {
          item['viewCampaignTypeName'] = 'Discount or Delivery fee Campaign';
        } else if (item['campaignType'] == 'COMBO_SET') {
          item['viewCampaignTypeName'] = 'Combo-Set Campaign';
        } else if (item['campaignType'] == 'BONUS') {
          item['viewCampaignTypeName'] = 'Bonus';
        } else if (item['campaignType'] == 'FREE_ITEM') {
          item['viewCampaignTypeName'] = 'Free Item';
        } else if (item['campaignType'] == 'SPONSORED_PARTNER_ITEMS') {
          item['viewCampaignTypeName'] = 'Sponsored Partner Items';
        } else if (item['campaignType'] == 'VOUCHER') {
          item['viewCampaignTypeName'] = 'Voucher';
        } else if (item['campaignType'] == 'OUT_OF_SCHEDULE') {
          item['viewCampaignTypeName'] = 'Out of Schedule Items';
        } else if (item['campaignType'] == 'PROMO_CODE') {
          item['viewCampaignTypeName'] = 'Promo Code';
        }
      });
    });

  }

  // begins implementation of any filter.
  filter() {
    this.page = 0;
    this.getCampaignListByFilter();
  }

  selectAll() {
    this.allCampaigns.forEach(item => {
      item.checked ? item.checked = false : item.checked = true;
      // this.selectedAll ? this.selectedAll = false : this.selectedAll = true;
    });
  }

  deleteCampaign() {
    for (let i = 0; i < this.allCampaigns.length; i++) {
      if (this.allCampaigns[i].checked) {
        this.campaignManagementService.removeCampaignById(this.allCampaigns[i]['id']).subscribe(res => {
          this.getAllCampaignByLimit();
        });
      }
    }


  }

  selectCampaign(event, id) {
    for (let i = 0; i < this.allCampaigns.length; i++) {
      if (this.allCampaigns[i].id == id) {
        this.allCampaigns[i].checked = event;
      }
    }
  }

  getAllCampaignByLimit() {
    this.campaignManagementService.get_all_campaigns_by_limit(0, 20).subscribe(res => {

      if (res) {
        this.cd.detectChanges();
        this.allCampaigns = res;


        this.allCampaigns.forEach(item => {
          item.checked = false;

          if (item['campaignType'] == 'DISCOUNT') {
            item['viewCampaignTypeName'] = 'Discount or Delivery fee Campaign';
          } else if (item['campaignType'] == 'COMBO_SET') {
            item['viewCampaignTypeName'] = 'Combo-Set Campaign';
          } else if (item['campaignType'] == 'BONUS') {
            item['viewCampaignTypeName'] = 'Bonus';
          } else if (item['campaignType'] == 'FREE_ITEM') {
            item['viewCampaignTypeName'] = 'Free Item';
          } else if (item['campaignType'] == 'SPONSORED_PARTNER_ITEMS') {
            item['viewCampaignTypeName'] = 'Sponsored Partner Items';
          } else if (item['campaignType'] == 'VOUCHER') {
            item['viewCampaignTypeName'] = 'Voucher';
          } else if (item['campaignType'] == 'OUT_OF_SCHEDULE') {
            item['viewCampaignTypeName'] = 'Out of Schedule Items';
          } else if (item['campaignType'] == 'PROMO_CODE') {
            item['viewCampaignTypeName'] = 'Promo Code';
          }

        });
      }


    });
  }

  // function for create sort params and send back end.
  sortButton(index) {

    for (let i = 0; i < this.campaignElements.length; i++) {
      if (i !== index) {
        this.campaignElements[i].sort.status = '';
      }
    }

    this.campaignElements[index].sort.status === 'asc' ?
      this.campaignElements[index].sort.status = 'desc' :
      this.campaignElements[index].sort.status = 'asc';

    this.allCampaigns = [];
    this.sortBy = this.campaignElements[index].sort;
    this.paginationCount = 0;
    this.getCampaignListByFilter();
  }

  // open roles popup list
  openCampaignTypeSelectOption(status) {
    if (status === 'create') {
      this.rolesCreateSelect = true;
    } else if (status === 'campaignTypeFilter') {
      this.isCampaignTypeSelectOptionOpen = true;
    }
  }

  // close filter roles list popup.
  closeCreatRoles(status) {
    status === 'filter' ?
      this.isCampaignTypeSelectOptionOpen = false :
      this.rolesCreateSelect = false;
  }


  // get role from option in create popup and filter.
  selectCampaignType(type, status, index) {

    if (status === 'campaignTypeFilter') {
      this.campaignTypeInputValue = this.campaignType[index].viewValue;
      this.isCampaignTypeSelectOptionOpen = false;
      this.writeInFilterInputs('campaignTypeFilter', type);
    }
  }


  // function for clear filter date input.
  deleteDate(event, type) {
    if (event.keyCode === 8) {
      if (type === 'startDateFilter') {
        this.startDateFilter = '';
        this.date1 = new FormControl(null);
        this.filter();
      } else if (type === 'endDateFilter') {
        this.endDateFilter = '';
        this.date2 = new FormControl(null);
        this.filter();
      }
    } else {
      return false;
    }
  }


  // function, which doesn't allow to input anything
  keyDownCampaignInput(event, type) {
    if (event.keyCode === 8) {
      this.campaignTypeInputValue = '';
      this[type] = '';
      this.filter();
    } else {
      return false;
    }
  }


  // get user list in time scroll
  scrollEvent(event) {
    this.contentHeight = this.content.nativeElement.clientHeight;
    const scrollCount = event.scrollTop;
    if (this.contentHeight - window.innerHeight < scrollCount && this.getNewallCampaigns) {
      this.getNewallCampaigns = false;
      // this.getCampaignListByFilter(this.paginationCount);
    }
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

  getDate(event, status) {

    let year, month, day;
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
    } else {
      this.endDateFilter = month + '/' + day + '/' + year;
      this.filter();
      // this.parseDateJsonFormatStart();
    }

    if (event.value) {
      // this.parseDateJsonFormatStart();
    }
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
        this.getCampaignListByFilter();
      }
    }
  }

  editCampaign(event, index) {
    this.getCampaignById(index);
  }

  generateRandomName() {
    let date = new Date();
    let second = date.getSeconds();
    let millisecond = date.getMilliseconds();
    this.randomGenerateNameValue = second.toString() + millisecond.toString();
  }

  copyCampaign(event, index) {
    this.getCampaignById(index);
    this.generateRandomName();
    let typeCampaignCopy = '';
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {


      // delete this.campaignForCopy['campaignDto']['campaign']['arm_name'];
      // delete this.campaignForCopy['campaignDto']['campaign']['ru_name'];

      if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'PROMO_CODE') {
        typeCampaignCopy = 'promoCode';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'DISCOUNT') {
        typeCampaignCopy = 'discount';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'SPONSORED_PARTNER_ITEMS') {
        typeCampaignCopy = 'sponsoredPartnerItems';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'OUT_OF_SCHEDULE') {
        typeCampaignCopy = 'outOfSchedule';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'VOUCHER') {
        typeCampaignCopy = 'voucher';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'FREE_ITEM') {
        typeCampaignCopy = 'freeItem';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'BONUS') {
        typeCampaignCopy = 'campaignBonus';
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] == 'COMBO_SET') {
        typeCampaignCopy = 'comboSet';
      }


      this.campaignForCopy['campaignDto']['campaign']['name'] = this.campaignForCopy['campaignDto']['campaign']['name'] + 'Copy' + this.randomGenerateNameValue;
      delete this.campaignForCopy['campaignDto']['campaign']['id'];

      if (this.campaignForCopy['campaignDto']['campaignTranslateDtoList'].length !== 0) {
        for (let i = 0; i < this.campaignForCopy['campaignDto']['campaignTranslateDtoList'].length; i++) {
          delete this.campaignForCopy['campaignDto']['campaignTranslateDtoList'][i]['language']['id'];
          delete this.campaignForCopy['campaignDto']['campaignTranslateDtoList'][i]['language']['defaultLanguage'];
          delete this.campaignForCopy['campaignDto']['campaignTranslateDtoList'][i]['language']['name'];
        }
      }


      if (this.campaignForCopy[typeCampaignCopy]['corporateClient']) {
        this.campaignForCopy[typeCampaignCopy]['corporateClient'] = {id: this.campaignForCopy[typeCampaignCopy]['corporateClient']['id']};
      }

      if (this.campaignForCopy[typeCampaignCopy]['label']) {
        this.campaignForCopy[typeCampaignCopy]['label'] = {id: this.campaignForCopy[typeCampaignCopy]['label']['id']};
      }

      if (this.campaignForCopy[typeCampaignCopy]['partner']) {
        this.campaignForCopy[typeCampaignCopy]['partner'] = {id: this.campaignForCopy[typeCampaignCopy]['partner']['id']};
      }
      delete this.campaignForCopy[typeCampaignCopy]['id'];


      for (let obj in this.campaignForCopy) {

        if (Array.isArray(this.campaignForCopy[obj])) {
          for (let i = 0; i < this.campaignForCopy[obj].length; i++) {
            this.campaignForCopy[obj][i]['menuItem'] = {id: this.campaignForCopy[obj][i]['menuItemId']};
          }
        }

      }

      for (let item in this.campaignForCopy) {
        for (let obj in this.campaignForCopy[item]) {
          if (obj === 'menuItemSet') {
            for (let i = 0; i < this.campaignForCopy[item][obj].length; i++) {
              this.campaignForCopy[item][obj][i] = {id: this.campaignForCopy[item][obj][i].id};
            }
          }
        }
      }


      for (let item in this.campaignForCopy) {
        for (let obj in this.campaignForCopy[item]) {
          if (obj === 'menuItem') {
            for (let key in this.campaignForCopy[item][obj]) {
              this.campaignForCopy[item]['menuItem'] = {id: this.campaignForCopy[item][obj]['id']};
            }
          }
        }
      }

      for (let item in this.campaignForCopy) {
        for (let obj in this.campaignForCopy[item]) {
          if (obj === 'serviceType') {
            for (let key in this.campaignForCopy[item][obj]) {
              delete this.campaignForCopy[item][obj]['name'];
              delete this.campaignForCopy[item][obj]['partners'];
            }
          }
        }
      }
      for (let item in this.campaignForCopy) {
        if (item === 'promoCode' && this.campaignForCopy[item]['menuItemSet'].length !== 0) {
          if (this.campaignForCopy[item]['fromMenu']) {
            this.campaignForCopy[item]['fromMenu'] = {id: this.campaignForCopy[item]['fromMenu']['id']};
          } else {
            this.campaignForCopy[item]['fromInventory'] = {id: this.campaignForCopy[item]['fromInventory']['id']};
          }

        }
      }

      this.saveCampaign();
    }, 1500);


  }

  saveCampaign() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'DISCOUNT') {

        this.campaignManagementService.addDiscountOrDeliveryCampaign(this.campaignForCopy).subscribe(res => {
          this.getAllCampaignByLimit();
        });
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'COMBO_SET') {
        this.campaignManagementService.addComboSetCampaign(this.campaignForCopy).subscribe(res => {
          this.getAllCampaignByLimit();
        });

      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'BONUS') {

        this.campaignManagementService.addBonusCampaign(this.campaignForCopy).subscribe(res => {

          this.getAllCampaignByLimit();
        });

      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'FREE_ITEM') {

        this.campaignManagementService.addFreeItemCampaign(this.campaignForCopy).subscribe(res => {

          this.getAllCampaignByLimit();
        });

      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'SPONSORED_PARTNER_ITEMS') {

        this.campaignManagementService.addSponsoredPartnerItemsCampaign(this.campaignForCopy).subscribe(res => {

          this.getAllCampaignByLimit();

        });
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'VOUCHER') {
        {
          this.campaignManagementService.addVoucherCampaign(this.campaignForCopy).subscribe(res => {


            this.getAllCampaignByLimit();
          });
        }
      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'OUT_OF_SCHEDULE') {

        this.campaignManagementService.addOutOfScheduleItemsCampaign(this.campaignForCopy).subscribe(res => {

          this.getAllCampaignByLimit();
        });

      } else if (this.campaignForCopy['campaignDto']['campaign']['campaignType'] === 'PROMO_CODE') {

        this.campaignManagementService.addPromoCodeCampaign(this.campaignForCopy).subscribe(res => {

          this.getAllCampaignByLimit();

        });
      }
    }, 1000);
  }

  getCampaignById(id) {
    this.campaignManagementService.getCampaignById(id).subscribe(res => {
      this.campaignForCopy = res;
    });
  }

  downloadTable() {
    window.location.href = this.url + 'download_campaign';
  }

}
