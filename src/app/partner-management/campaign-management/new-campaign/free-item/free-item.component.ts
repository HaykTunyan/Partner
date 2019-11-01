import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocompleteSelectedEvent} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {FormControl} from '@angular/forms';
import {FilesService} from '../../../../services/files/files.service';
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
  selector: 'app-free-item',
  templateUrl: './free-item.component.html',
  styleUrls: ['./free-item.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class FreeItemComponent implements OnInit, DoCheck {
  @Input('freeItem') valueGetCampaignById;
  @ViewChild('freeItemAttachMenu') freeItemAttachMenu: ElementRef<HTMLInputElement>;
  imageUrl: string = null;
  file;
  partnerImageUrl: string;
  imageInput = ''
  data = {
    image: ''
  };

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
  nameAndImageNAME;
  freeItemType = [
    {
      name: 'From Inventory',
      checked: true,
      value: 'INVENTORY'
    },
    {
      name: 'From Menu',
      checked: false,
      value: 'MENU'
    }
  ];

  selectedCampaignType;
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

  freeItemPartnerList: any = [];
  freeItemList: any = [];
  commissionPercentage = '';

  attachMenuItem = [];
  discountRate;
  deliveryFee;
  changeDiscountRateStatusValue = false;
  changeCommissionRateStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  attachMenu = [];
  selectedValuePartner = this.freeItemPartnerList[0];
  commissionRate;

  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  setTimeOutFunctionCall;

  //calendar variabals
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  date3 = new FormControl(moment()); // form for end time material input.
  date4 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  startDate1: any; // start date value.
  endDate: any; // end date value.
  endDate1: any; // end date value.
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  freeItemUpdateObject: any = {
    freeItem: {},
    'menuItemPercentageDtoSet': []
  };
  freeItem = {
    'freeItem': {
      'commissionRatePerMenuItem': true,
      'campaignPartnerType': 'BRAND',
      'commissionRate': '',
      'endDate': '',
      'everyOrders': '',
      'freeItemType': 'INVENTORY',
      'fromInventory': {
        'id': ''
      },
      'itemFullName': '',
      'itemImage': '',
      'menuItemFromMenu': {
        'id': ''
      },
      'moreThanOrders': '',
      'ordersType': 'AMOUNT_ORDERS',
      'partner': {
        'id': ''
      },
      'quantity': 1 | 1,
      'startDate': '',
      'validOrders': ''
    },
    'menuItemPercentageDtoSet': []
  };
  partnerValue;
  fromInventoryValue;
  fromMenuValue;
  freeItemPartnerValidator = false;
  freeItemValidator = false;
  freeItemFullNameValidator = false;
  freeItemMenuValidator = false;
  freeItemImageValidator = false;

  constructor(private filesService: FilesService, private campaignManagementService: CampaignManagementService) {
  }

  ngOnInit() {
    this.getAllFreeItemPartnerList();
    this.getAllFreeItemListFromInventory();
    if (this.valueGetCampaignById && !this.campaignManagementService.changeCampaignTypeStatus) {
      this.setValueInUpdate();
    }
    this.campaignManagementService.changeCampaignTypeStatus = false
  }

  getAllFreeItemPartnerList() {
    this.campaignManagementService.getAllPartnersList().subscribe(res => {
      this.freeItemPartnerList = res;
    });
  }

  getAllFreeItemListFromInventory() {
    this.campaignManagementService.getAllGiftsList().subscribe(res => {
      this.freeItemList = res;
    });
  }

  setValueInService() {
    this.campaignManagementService.freeItem.freeItem = this.freeItem.freeItem;
    this.campaignManagementService.freeItem.menuItemPercentageDtoSet = this.freeItem.menuItemPercentageDtoSet;
    if (this.freeItem.menuItemPercentageDtoSet.length > 0) {
      this.campaignManagementService.freeItemValidator.menuItem = this.freeItem.menuItemPercentageDtoSet.length.toString();
    }
    this.campaignManagementService.freeItemValidator.partnerValue = this.freeItem.freeItem.partner.id;
    this.campaignManagementService.freeItemValidator.freeItemName = this.freeItem.freeItem.itemFullName;
    this.campaignManagementService.freeItemValidator.freeItemImage = this.freeItem.freeItem.itemImage;

    if (this.freeItem.freeItem.itemFullName !== '') {
      this.freeItemFullNameValidator = false;
    }
  }

  getInputValue(value?, type?) {

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      if (type == 'discountRate') {
        /*for (let i = 0; i < this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems.length; i++) {
          this.discountOrDeliveryFeeCampaign.discountPercentageMenuItems[i].discountRate = value;
        }*/
      } else if (type == 'commissionRate') {
        for (let i = 0; i < this.freeItem.menuItemPercentageDtoSet.length; i++) {
          this.freeItem.menuItemPercentageDtoSet[i].percentage = value;
        }
      }


      this.setValueInService();

    }, 1000);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  backupRadioClick(index, type) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    this.timePeriodIndex = index;
  }


  remove(name: string): void {


    for (let i = 0; i < this.attachMenu.length; i++) {

      if (this.attachMenu[i]['name'] == name) {
        this.attachMenu.splice(i, 1);
        this.freeItem.menuItemPercentageDtoSet = [];
        for (let i = 0; i < this.attachMenu.length; i++) {
          this.freeItem.menuItemPercentageDtoSet.push(
            {
              'percentage': 0,
              'menuItem': {
                'id': this.attachMenu[i].id
              }
            }
          );

        }

      }
    }

    if (this.attachMenu.length == 0) {
      this.freeItemMenuValidator = true;
    }

    this.setValueInService();


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.attachMenu.push(event.option.value);
    this.freeItem.menuItemPercentageDtoSet = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.freeItem.menuItemPercentageDtoSet.push(
        {
          'percentage': 0,
          'menuItem': {
            'id': this.attachMenu[i].id
          }
        }
      );
      this.freeItemAttachMenu.nativeElement.blur();
    }

    this.freeItemMenuValidator = false;
    this.setValueInService();

  }

  changeDiscountRateStatus() {
    this.changeDiscountRateStatusValue ?
      this.changeDiscountRateStatusValue = false :
      this.changeDiscountRateStatusValue = true;

  }

  changeCommissionRateStatus() {
    this.changeCommissionRateStatusValue ? this.changeCommissionRateStatusValue = false : this.changeCommissionRateStatusValue = true;
    this.freeItem.freeItem.commissionRatePerMenuItem = this.changeCommissionRateStatusValue;
    this.setValueInService();
  }

  setInputValueEveryItem(value, id, type) {

    let arrayItems = this.freeItem.menuItemPercentageDtoSet;
    for (let i = 0; i < arrayItems.length; i++) {

      if (arrayItems[i].menuItem.id == id && type === 'commissionRate') {
        this.freeItem.menuItemPercentageDtoSet[i].percentage = value;
        this.setValueInService();
      }

    }
  }


  changeValuePartner(event) {
    this.attachMenuItem = event.menuItemDto;
    this.selectedValuePartner = event;
    this.freeItem.freeItem.partner.id = event.id;
    this.attachMenu = [];
    this.fromInventoryValue = '';
    this.fromMenuValue = '';
    this.freeItemPartnerValidator = false;
    this.setValueInService();
  }


  freeItemRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;

    if (types == 'discountType') {
      this.freeItem.freeItem.campaignPartnerType = type[index].value;
    } else if (types == 'freeItemType') {
      this.freeItem.freeItem.freeItemType = type[index].value;
    }


    this.timePeriodIndex = index;
    this.setValueInService();
  }


//  calendar function state start

  // get date from mat date input.
  getDate(event, status) {
    this[status] = event.value['_d'];
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
        this.freeItem.freeItem.startDate = this[status];
        this.setValueInService();
      } else {
        this.freeItem.freeItem.endDate = this[status];
        this.setValueInService();
      }

    }, 1500);
  }

//  calendar function state end


  changeValueCampaignType(value, type) {

    if (type == 'inventory') {
      this.campaignManagementService.freeItemValidator.freeItem = value;
      this.freeItem.freeItem.fromInventory.id = value.id;
      this.freeItem.freeItem.menuItemFromMenu.id = '';
    } else if (type == 'fromMenu') {
      this.campaignManagementService.freeItemValidator.freeItem = value;
      this.freeItem.freeItem.menuItemFromMenu.id = value.id;
      this.freeItem.freeItem.fromInventory.id = '';
    }


    this.freeItemValidator = false;
    this.setValueInService();
  }

  //Image Upload
  onFileSelected(event) {
    this.file = event.target.files[0];
    this.imageUrl = this.file.name;
    const uploadData = new FormData();
    uploadData.append('file', this.file, this.imageUrl);
    this.filesService.saveFile(uploadData, 'IMAGE').subscribe(res => {
      if (res) {
        this.partnerImageUrl = res;
        this.data.image = this.partnerImageUrl;
        this.freeItem.freeItem.itemImage = this.partnerImageUrl;
        this.imageInput = ''
        this.setValueInService();
        this.freeItemImageValidator = false;
      }
    });
  }

  deleteAttachImg() {
    this.partnerImageUrl = null;
    this.imageUrl = null;
    this.freeItem.freeItem.itemImage = '';
    this.imageInput = ''
    this.setValueInService();
    if (this.freeItem.freeItem.itemImage == '') {
      this.freeItemImageValidator = true;
    }
  }

  freeItemOrderFeeRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;


    if (index === 0 && types === 'orderFee') {
      this.freeItem.freeItem.everyOrders = '';
      this.setValueInService();

    } else {
      this.freeItem.freeItem.moreThanOrders = '';
      this.setValueInService();


    }
    this.timePeriodIndex = index;
    this.setValueInService();
  }

  compareToObject() {

    let id = this.freeItemUpdateObject.freeItem.partner.id;
    if (_.isEqual(this.freeItem, this.freeItemUpdateObject)) {
    } else {
      // this.comboSet =JSON.parse(JSON.stringify(this.tempComboSetObject)) ;
      this.freeItem.freeItem = JSON.parse(JSON.stringify(this.freeItemUpdateObject.freeItem));
      this.freeItem.menuItemPercentageDtoSet = JSON.parse(JSON.stringify(this.freeItemUpdateObject.menuItemPercentageDtoSet));


      this.freeItem.freeItem.partner = {id: id};

      if (this.freeItem.freeItem.fromInventory !== null) {
        this.freeItem.freeItem.fromInventory = {id: this.freeItemUpdateObject.freeItem.fromInventory.id};
      } else {
        this.freeItem.freeItem.fromInventory = {id: ''};
      }

      if (this.freeItem.freeItem.menuItemFromMenu !== null) {
        this.freeItem.freeItem.menuItemFromMenu = {id: this.freeItemUpdateObject.freeItem.menuItemFromMenu.id};
      } else {
        this.freeItem.freeItem.menuItemFromMenu = {id: ''};
      }


      if (this.freeItem.freeItem.moreThanOrders !== null) {
        this.freeItem.freeItem.moreThanOrders = this.freeItemUpdateObject.freeItem.moreThanOrders;
      } else {
        this.freeItem.freeItem.moreThanOrders = '';
      }

      if (this.freeItem.freeItem.everyOrders !== null) {
        this.freeItem.freeItem.everyOrders = this.freeItemUpdateObject.freeItem.everyOrders;
      } else {
        this.freeItem.freeItem.everyOrders = '';
      }
      if (this.freeItem.freeItem.commissionRate !== null) {
        this.freeItem.freeItem.commissionRate = this.freeItemUpdateObject.freeItem.commissionRate;
      } else {
        this.freeItem.freeItem.commissionRate = '';
      }
      /* if (this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount == null) {
         this.discountOrDeliveryFeeCampaign.discount.orderMinimumForDiscount = '';
       }*/

      /* if (this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount == null) {
         this.discountOrDeliveryFeeCampaign.discount.discountForEveryOrderAmount = '';
       }*/
      /*{
        'percentage': 0,
        'menuItem': {
        'id': this.attachMenu[i].id
      }
      }*/
      this.freeItem.menuItemPercentageDtoSet = [];
      for (let i = 0; i < this.freeItemUpdateObject.menuItemPercentageDtoSet.length; i++) {

        this.freeItem.menuItemPercentageDtoSet.push(
          {
            id: this.freeItemUpdateObject.menuItemPercentageDtoSet[i].id,
            'percentage': this.freeItemUpdateObject.menuItemPercentageDtoSet[i].percentage,
            'menuItem': {
              'id': this.freeItemUpdateObject.menuItemPercentageDtoSet[i]['menuItemId']
            }
          }
        );
      }

      this.setValueInService();
    }

  }

  setValueInUpdate() {
   // console.log(this.valueGetCampaignById);
    this.freeItemUpdateObject.freeItem = this.valueGetCampaignById.freeItem;
    this.freeItemUpdateObject.menuItemPercentageDtoSet = this.valueGetCampaignById.menuItemPercentageDtoSet;

    this.freeItem.freeItem.quantity = this.valueGetCampaignById.freeItem.quantity;
    this.changeCommissionRateStatusValue = this.valueGetCampaignById.freeItem.commissionRatePerMenuItem;
    this.freeItem.freeItem.commissionRate = this.valueGetCampaignById.freeItem.commissionRate;
    this.freeItem.freeItem.validOrders = this.valueGetCampaignById.freeItem.validOrders;
    this.freeItem.freeItem.itemFullName = this.valueGetCampaignById.freeItem.itemFullName;
    this.partnerImageUrl = this.valueGetCampaignById.freeItem['itemImage'];
    this.imageUrl = this.valueGetCampaignById.freeItem['itemImage'];
    this.freeItem.freeItem.moreThanOrders = this.valueGetCampaignById.freeItem.moreThanOrders;
    this.freeItem.freeItem.everyOrders = this.valueGetCampaignById.freeItem.everyOrders;


    for (let i = 0; i < this.discountType.length; i++) {
      if (this.discountType[i].value === this.valueGetCampaignById.freeItem.campaignPartnerType && i === 0) {
        this.discountType[0].checked = true;
        this.discountType[1].checked = false;
      } else if (this.discountType[i].value === this.valueGetCampaignById.freeItem.campaignPartnerType && i === 1) {
        this.discountType[1].checked = true;
        this.discountType[0].checked = false;
      }
    }

    for (let i = 0; i < this.orderFee.length; i++) {
      if (this.valueGetCampaignById.freeItem.everyOrders !== null) {
        this.orderFee[0].checked = false;
        this.orderFee[1].checked = true;
      } else if (this.valueGetCampaignById.freeItem.moreThanOrders !== null) {
        this.orderFee[0].checked = true;
        this.orderFee[1].checked = false;
      }
    }


    if (this.valueGetCampaignById.freeItem.startDate != null) {

      let startTime = this.valueGetCampaignById.freeItem.startDate.substring(0, 5);

      this.firstTimeValue = startTime;
    }

    if (this.valueGetCampaignById.freeItem.endDate != null) {
      let endTime = this.valueGetCampaignById.freeItem.endDate.substring(0, 5);

      this.secondTimeValue = endTime;
    }


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {


      for (let i = 0; i < this.freeItemPartnerList.length; i++) {
        if (this.freeItemPartnerList[i].id == this.valueGetCampaignById.freeItem.partner.id) {
          this.partnerValue = this.freeItemPartnerList[i];
          this.attachMenu = this.valueGetCampaignById.menuItemPercentageDtoSet;
          this.attachMenuItem = this.freeItemPartnerList[i]['menuItemDto'];
        }
      }


      if (this.valueGetCampaignById.freeItem.freeItemType == 'MENU') {
        this.freeItemType[0].checked = false;
        this.freeItemType[1].checked = true;
        for (let i = 0; i < this.attachMenu.length; i++) {
          if (this.attachMenu[i].menuItemId === this.valueGetCampaignById.freeItem.menuItemFromMenu.id) {
            this.fromMenuValue = this.attachMenu[i];
            this.campaignManagementService.freeItemValidator.freeItem = this.fromMenuValue;
          }
        }
      }

      if (this.valueGetCampaignById.freeItem.freeItemType == 'INVENTORY') {
        this.freeItemType[0].checked = true;
        this.freeItemType[1].checked = false;
        for (let i = 0; i < this.freeItemList.length; i++) {
          if (this.freeItemList[i].id === this.valueGetCampaignById.freeItem.fromInventory.id) {
            this.fromInventoryValue = this.freeItemList[i];
            this.campaignManagementService.freeItemValidator.freeItem = this.fromInventoryValue;
          }
        }

      }
      for (let i = 0; i < this.partnerValue.menuItemDto.length; i++) {
        for (let j = 0; j < this.valueGetCampaignById.menuItemPercentageDtoSet.length; j++) {
          this.commissionPercentage = this.valueGetCampaignById.menuItemPercentageDtoSet[j].percentage;
          if (this.partnerValue.menuItemDto[i].id === this.valueGetCampaignById.menuItemPercentageDtoSet[j].menuItemId) {
            this.attachMenu[j].menuName = this.partnerValue.menuItemDto[i].menuName;

          }
        }
      }
      this.compareToObject();
    }, 1000);
  }

  ngDoCheck(): void {
    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.freeItemValidator.partnerValue == '') {
        this.freeItemPartnerValidator = true;
      } else {
        this.freeItemPartnerValidator = false;
      }

      if (this.campaignManagementService.freeItemValidator.menuItem == '') {
        this.freeItemMenuValidator = true;
      } else {
        this.freeItemMenuValidator = false;
      }

      if (this.campaignManagementService.freeItemValidator.freeItem == '') {
        this.freeItemValidator = true;
      } else {
        this.freeItemValidator = false;
      }
      if (this.campaignManagementService.freeItemValidator.freeItemName == '') {
        this.freeItemFullNameValidator = true;
      } else {
        this.freeItemFullNameValidator = false;
      }
      if (this.campaignManagementService.freeItemValidator.freeItemImage == '') {
        this.freeItemImageValidator = true;
      } else {
        this.freeItemImageValidator = false;
      }
      // this.campaignManagementService.saveButtonClick = 0
    }


    // this.campaignManagementService.saveButtonClick = 0;

  }


}
