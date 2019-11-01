import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';


import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {CampaignManagementService} from '../../../../services/campaign-management/campaign-management.service';
import * as _ from 'lodash';


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
  selector: 'app-discount-or-delivery-fee-campaign',
  templateUrl: './discount-or-delivery-fee-campaign.component.html',
  styleUrls: ['./discount-or-delivery-fee-campaign.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DiscountOrDeliveryFeeCampaignComponent implements OnInit, DoCheck {

  @ViewChild('discountOrDeliveryAttachMenu') public discountOrDeliveryAttachMenu: ElementRef<HTMLInputElement>;


  discountType = [
    {
      name: 'Brand',
      value: 'BRAND',
      checked: true
    },
    {
      name: 'Branch',
      value: 'BRANCH',
      checked: false
    }
  ];
  setTimeOutFunctionCall;
  orderFee = [
    {
      name: 'Order which amount is more than',
      checked: true
    },
    {
      name: 'Orders for every',
      checked: false
    }
  ];
  timePeriodIndex = 0; // checked time period index.

  discountOrDeliveryPartnerList: any = [];
  commissionRate = '';
  discountRate = '';
  attachMenuItem = [];
  deliveryFee;
  changeDiscountRateStatusValue = false;
  changeCommissionRateStatusValue = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  discountFormControl = new FormControl();
  attachMenu = [];
  selectedValuePartner = this.discountOrDeliveryPartnerList[0];
  commissionPercentage = '';
  discountPercentage = '';
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  discountValidator = false;
  attachMenuItemValidator = false;
  partnerValidator = false;

  //calendar variabals
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  partnerValue;


  counter = 0;

  valueChanged() { // You can give any function name
    this.counter = this.counter + 1;

  }

  discountOrDeliveryFeeCampaignTempUpdateObject: any = {
    'discount': {},
    'discountPercentageMenuItems': []
  };
  discountOrDeliveryFeeCampaign = {

    'discount': {
      'campaignPartnerType': 'BRAND',
      'commissionForAllMenuItems': false,
      'commissionRate': '',
      'deliveryFee': '',
      'discountForAllMenuItems': false,
      'discountForEveryOrderAmount': '',
      'discountRate': '',
      'endDate': '',
      'orderMinimumForDiscount': '',
      'partner': {
        'id': ''
      },
      'quantity': '1',
      'startDate': '',
      'validOrders': ''
    },
    'discountPercentageMenuItems': []
  };
  @Input('discoundOrDelivery') valueGetCampaignById;

  constructor(private campaignManagementService: CampaignManagementService) {
  }

  ngOnInit() {
   // console.log(this.campaignManagementService.changeCampaignTypeStatus);
    this.getAllPartnerList();
    if (this.valueGetCampaignById && !this.campaignManagementService.changeCampaignTypeStatus) {
      //console.log('mdav initi ifi mech',this.campaignManagementService.changeCampaignTypeStatus);
      this.setValueInUpdate();

    }
    this.campaignManagementService.changeCampaignTypeStatus = false
   // console.log(this.campaignManagementService.changeCampaignTypeStatus);
  }


  compareToObject() {

    let id = this.discountOrDeliveryFeeCampaignTempUpdateObject.discount.partner.id;
    //

    if (_.isEqual(this.discountOrDeliveryFeeCampaign, this.discountOrDeliveryFeeCampaignTempUpdateObject)) {
    } else {


      this.discountOrDeliveryFeeCampaign = JSON.parse(JSON.stringify(this.discountOrDeliveryFeeCampaignTempUpdateObject));

      this.discountOrDeliveryFeeCampaign.discount.partner = {id: id};
      if (this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount == null) {
        this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount = '';
      }

      if (this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount == null) {
        this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount = '';
      }


      this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems = [];
      for (let i = 0; i < this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems.length; i++) {

        this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.push(
          {
            id: this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].id,
            'commissionPercentage': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].commissionPercentage,
            'discountPercentage': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].discountPercentage,
            'menuItem': {
              'id': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i]['menuItemId']
            }
          }
        );
      }


      this.setValueInService();
    }

  }

  setValueInUpdate() {
    // console.log(this.valueGetCampaignById);
    this.discountOrDeliveryFeeCampaignTempUpdateObject.discount = this.valueGetCampaignById.discount;
    this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems = this.valueGetCampaignById['discountPercentageMenuItems'];

    this.discountOrDeliveryFeeCampaign.discount.campaignPartnerType = this.valueGetCampaignById.discount.campaignPartnerType;
    this.changeCommissionRateStatusValue = this.valueGetCampaignById.discount.commissionForAllMenuItems;
    this.changeDiscountRateStatusValue = this.valueGetCampaignById.discount.discountForAllMenuItems;
    this.discountOrDeliveryFeeCampaign.discount.commissionRate = this.valueGetCampaignById.discount.commissionRate;
    this.discountOrDeliveryFeeCampaign.discount.deliveryFee = this.valueGetCampaignById.discount.deliveryFee;
    this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount = this.valueGetCampaignById.discount.discountForEveryOrderAmount;
    this.discountOrDeliveryFeeCampaign.discount.discountRate = this.valueGetCampaignById.discount.discountRate;
    this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount = this.valueGetCampaignById.discount.orderMinimumForDiscount;
    this.discountOrDeliveryFeeCampaign.discount.quantity = this.valueGetCampaignById.discount.quantity;
    this.discountOrDeliveryFeeCampaign.discount.validOrders = this.valueGetCampaignById.discount.validOrders;


    if (this.valueGetCampaignById.discount.startDate != null) {

      let startTime = this.valueGetCampaignById.discount.startDate.substring(0, 5);

      this.firstTimeValue = startTime;
    }

    if (this.valueGetCampaignById.discount.endDate != null) {
      let endTime = this.valueGetCampaignById.discount.endDate.substring(0, 5);

      this.secondTimeValue = endTime;
    }

    if (this.valueGetCampaignById.discount.orderMinimumForDiscount) {
      this.orderFee[0].checked = true;
      this.orderFee[1].checked = false;
    }
    if (this.valueGetCampaignById.discount.discountForEveryOrderAmount) {
      this.orderFee[1].checked = true;
      this.orderFee[0].checked = false;
    }

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      for (let i = 0; i < this.discountOrDeliveryPartnerList.length; i++) {
        if (this.discountOrDeliveryPartnerList[i].id == this.valueGetCampaignById.discount.partner.id) {
          this.partnerValue = this.discountOrDeliveryPartnerList[i];
          this.attachMenu = this.valueGetCampaignById.discountPercentageMenuItems;
          this.attachMenuItem = this.discountOrDeliveryPartnerList[i]['menuItemDto'];

        }
      }
      for (let i = 0; i < this.partnerValue.menuItemDto.length; i++) {
        for (let j = 0; j < this.valueGetCampaignById.discountPercentageMenuItems.length; j++) {
          this.commissionPercentage = this.valueGetCampaignById.discountPercentageMenuItems[j].commissionPercentage;
          this.discountPercentage = this.valueGetCampaignById.discountPercentageMenuItems[j].discountPercentage;
          if (this.partnerValue.menuItemDto[i].id === this.valueGetCampaignById.discountPercentageMenuItems[j].menuItemId) {
            this.attachMenu[j].menuName = this.partnerValue.menuItemDto[i].menuName;
            this.attachMenu[j].id = this.partnerValue.menuItemDto[i].id;
          }
        }
      }
      this.compareToObject();
    }, 1500);
  }

  setValueInService() {
    this.campaignManagementService.discountOrDelivery = this.discountOrDeliveryFeeCampaign;
    this.campaignManagementService.discountOrDeliveryValidatorArray[0].deliveryFee = this.discountOrDeliveryFeeCampaign.discount.deliveryFee;
    this.campaignManagementService.discountOrDeliveryValidatorArray[0].discountRate = this.discountOrDeliveryFeeCampaign.discount.discountRate;

    if (this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length > 0) {
      this.campaignManagementService.discountOrDeliveryValidatorArray[0].menuItem = this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length.toString();
    }

    for (let i = 0; i < this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length; i++) {
      if (this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i]['discountPercentage'] > 0) {
        this.campaignManagementService.discountOrDeliveryValidatorArray[0].everyItemSetValue = this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i]['discountPercentage'];
      }
    }

    this.campaignManagementService.discountOrDeliveryValidatorArray[0].partnerValue = this.discountOrDeliveryFeeCampaign.discount.partner.id;

  }

  getAllPartnerList() {
    this.campaignManagementService.getAllPartnersList().subscribe(res => {
      this.discountOrDeliveryPartnerList = res;
    });
  }

  discountRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'discountType') {
      this.discountOrDeliveryFeeCampaign.discount.campaignPartnerType = type[index].value;
      this.setValueInService();
    }


    this.timePeriodIndex = index;
  }


  remove(name: string): void {


    for (let i = 0; i < this.attachMenu.length; i++) {

      if (this.attachMenu[i]['name'] == name) {
        this.attachMenu.splice(i, 1);
        this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems = [];
        if (this.valueGetCampaignById) {
          for (let i = 0; i < this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems.length; i++) {
            this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.push(
              {
                id: this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].id,
                'commissionPercentage': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].commissionPercentage,
                'discountPercentage': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i].discountPercentage,
                'menuItem': {
                  'id': this.discountOrDeliveryFeeCampaignTempUpdateObject.discountPercentageMenuItems[i]['menuItemId']
                }
              }
            );
          }
        } else {
          for (let i = 0; i < this.attachMenu.length; i++) {
            this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.push(
              {
                id: this.attachMenu[i].id
              }
            );

          }
        }
      }
    }

    if (this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length == 0) {
      this.attachMenuItemValidator = false;
    }

    this.setValueInService();


  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.attachMenu.push(event.option.value);
    this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.push(
        {
          'commissionPercentage': 0,
          'discountPercentage': 0,
          'menuItem': {
            'id': this.attachMenu[i].id
          }
        }
      );

    }
    this.attachMenuItemValidator = false;
    this.setValueInService();
    this.discountOrDeliveryAttachMenu.nativeElement.blur();
  }

  changeDiscountRateStatus() {

    this.changeDiscountRateStatusValue ? this.changeDiscountRateStatusValue = false : this.changeDiscountRateStatusValue = true;

    this.discountOrDeliveryFeeCampaign.discount.discountForAllMenuItems = this.changeDiscountRateStatusValue;
    this.setValueInService();
  }

  changeCommissionRateStatus() {
    this.changeCommissionRateStatusValue ? this.changeCommissionRateStatusValue = false : this.changeCommissionRateStatusValue = true;
    this.discountOrDeliveryFeeCampaign.discount.commissionForAllMenuItems = this.changeCommissionRateStatusValue;
    this.setValueInService();
  }


  changeValuePartner(event) {
    this.selectedValuePartner = event;
    this.attachMenuItem = event.menuItemDto;
    this.attachMenu = [];
    this.discountOrDeliveryFeeCampaign.discount.partner.id = event.id;
    this.partnerValidator = false;
    this.setValueInService();
  }

  setInputValueEveryItem(value, id, type) {
    let arrayItems = this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems;
    for (let i = 0; i < arrayItems.length; i++) {
      if (arrayItems[i]['menuItem'].id == id && type === 'commissionRate') {

        this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i].commissionPercentage = value;
        this.setValueInService();
      } else if (arrayItems[i]['menuItem'].id == id && type === 'discountRate') {
        this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i].discountPercentage = value;
        this.setValueInService();
      }

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  // clear keypress validation for time inputs.
  clearTimeDada(event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }

  // key press validation for material data picker.
  keyDownDateInput(event, status) {
    if (event.keyCode === 8) {
      if (status === 1) {
        this.startDate = new FormControl(null);
      } else if (status === 2) {
        this.endDate = new FormControl(null);
      }
    } else {
      return false;
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


  // change time format to correct format.
  changeTimeFormat(value, status) {
    this[status] = value;
    if (value.length === 2) {
      if (value * 1 > 23) {
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


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      if (status === 'firstTimeValue') {
        this.discountOrDeliveryFeeCampaign.discount.startDate = this[status];
        this.setValueInService();
      } else {
        this.discountOrDeliveryFeeCampaign.discount.endDate = this[status];
        this.setValueInService();
      }

    }, 0);
  }

//  calendar function state end


  getInputValue(value?, type?) {
    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      if (type == 'discountRate') {
        for (let i = 0; i < this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length; i++) {
          this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i].discountPercentage = value;
        }
        this.discountValidator = false;
      } else if (type == 'commissionRate') {
        for (let i = 0; i < this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length; i++) {
          this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i].commissionPercentage = value;
        }
      }

      if (this.discountOrDeliveryFeeCampaign.discount.deliveryFee !== '' || this.discountOrDeliveryFeeCampaign.discount.discountRate !== '') {
        this.discountValidator = false;
      }
      this.setValueInService();

    }, 0);
  }


  discountOrderFeeRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (index === 0 && types === 'orderFee') {
      this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount = '';
      this.setValueInService();

    } else {
      this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount = '';
      this.setValueInService();


    }
    this.timePeriodIndex = index;
    this.setValueInService();
  }

  ngDoCheck(): void {

    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.discountOrDeliveryValidatorArray[0].deliveryFee == ''
        && this.campaignManagementService.discountOrDeliveryValidatorArray[0].discountRate == ''
        && this.campaignManagementService.discountOrDeliveryValidatorArray[0].everyItemSetValue == '') {
        this.discountValidator = true;
      } else {
        this.discountValidator = false;
      }

      if (this.campaignManagementService.discountOrDeliveryValidatorArray[0].partnerValue == '') {
        this.partnerValidator = true;
      } else {
        this.partnerValidator = false;
      }

      if (this.campaignManagementService.discountOrDeliveryValidatorArray[0].menuItem == '') {
        this.attachMenuItemValidator = true;
      } else {
        this.attachMenuItemValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }

  }
}
