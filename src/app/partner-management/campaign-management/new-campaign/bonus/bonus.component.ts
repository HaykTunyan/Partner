import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocompleteSelectedEvent} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
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
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class BonusComponent implements OnInit, DoCheck {
  @Input('bonus') valueGetCampaignById;
  @ViewChild('bonusAttachMenuItem') public bonusAttachMenuItem: ElementRef<HTMLInputElement>;
  @ViewChild('bonusWithPercent') public bonusWithPercent:ElementRef<HTMLSelectElement>
  @ViewChild('bonusWithUnit') public bonusWithUnit:ElementRef<HTMLSelectElement>
  //variable in bonus objects
  moreThanOrders = '';
  everyOrders = '';
  orderFeeInput;
  bonusPartnerValidator = false;
  bonusMenuItemValidator = false;

  ///////////////////////////////////////////////////////////
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

  personalBonuses = [

    {
      name: 'Bonus for Adding Email Address',
      active: false
    },
    {
      name: 'Bonus for Adding Birthday Date',
      active: false
    },

    {
      name: 'Bonus for Adding Credit Card',
      active: false
    }
  ];
  timePeriodIndex = 0; // checked time period index.

  bonusAttachPartners: any = [];
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
  selectedValuePartner = this.bonusAttachPartners[0];
  commissionRate;
  partnerValue;
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  emailValue = '';
  birthdayValue = '';
  cardValue = '';

  //calendar variabals
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  commissionPercentage = '';
  discountPercentage = '';
  bonusUpdateTempObject = {
    campaignBonus: {},
    campaignBonusPercentageMenuItem: []
  };
  bonus: any = {
    campaignBonus: {
      allItemsCommission: false,
      allItemsDiscount: false,
      birthdayBonus: false,
      bonusForBDay: '',
      bonusForCreditCard: '',
      bonusForEmail: '',
      bonusWithPercent: '',
      bonusWithUnit: '',
      campaignPartnerType: 'BRAND',
      cardBonus: false,
      commissionRate: '',
      deliveryFee: '',
      discountRate: 0,
      emailBonus: false,
      endDate: '',
      everyOrders: '',
      moreThanOrders: '',
      partner: {
        id: ''
      },
      quantity: 1 | 1,
      startDate: '',
      validOrders: ''
    },
    campaignBonusPercentageMenuItem: []
  };

  constructor(private campaignManagementService: CampaignManagementService) {
  }

  ngOnInit() {
    this.getAllPartnerList();
    if (this.valueGetCampaignById && !this.campaignManagementService.changeCampaignTypeStatus) {
      this.setValueInUpdate();
    }
    this.campaignManagementService.changeCampaignTypeStatus = false
  }


  getAllPartnerList() {
    this.campaignManagementService.getAllPartnersList().subscribe(response => {
      if (response) {
        this.bonusAttachPartners = response;
      }
    });
  }

  bonusRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'discountType') {
      this.bonus.campaignBonus.campaignPartnerType = type[index].value;
    }

    if (index === 0 && types === 'orderFee') {
      this.bonus.campaignBonus.everyOrders = '';
    } else {
      this.bonus.campaignBonus.moreThanOrders = '';

    }
    this.timePeriodIndex = index;
    this.setValueInService();
  }


  remove(name: string): void {
    // menuItemName

    if (this.valueGetCampaignById) {
      for (let i = 0; i < this.attachMenu.length; i++) {

        if (this.attachMenu[i]['name'] == name) {
          this.attachMenu.splice(i, 1);
          this.bonus.campaignBonusPercentageMenuItem = [];
          for (let i = 0; i < this.attachMenu.length; i++) {
            this.bonus.campaignBonusPercentageMenuItem.push(
              {
                commissionPercentage: 0,
                discountPercentage: 0,
                menuItem: {
                  id: this.attachMenu[i].menuItemId
                }
              });
          }
        }
      }
    }else {
      for (let i = 0; i < this.attachMenu.length; i++) {
        if (this.attachMenu[i]['name'] == name) {
          this.attachMenu.splice(i, 1);
          this.bonus.campaignBonusPercentageMenuItem = [];
          for (let i = 0; i < this.attachMenu.length; i++) {
            this.bonus.campaignBonusPercentageMenuItem.push(
              {
                commissionPercentage: 0,
                discountPercentage: 0,
                menuItem: {
                  id: this.attachMenu[i].id
                }
              });
          }
        }
      }
    }


    if (this.bonus.campaignBonusPercentageMenuItem.length === 0) {
      this.bonusMenuItemValidator = true;
    }
    this.setValueInService();

  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.attachMenu.push(event.option.value);
    this.bonus.campaignBonusPercentageMenuItem = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.bonus.campaignBonusPercentageMenuItem.push(
        {
          commissionPercentage: 0,
          discountPercentage: 0,
          menuItem: {
            id: this.attachMenu[i].id
          }
        }
      );

    }
    this.bonusMenuItemValidator = false;
    this.setValueInService();
    this.bonusAttachMenuItem.nativeElement.blur();

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  changepersonalBonusesStatus(index, type) {
    // type[index].active = true
    type[index].active ? type[index].active = false : type[index].active = true;
    this.setValueInService();
    this.personalBonuses.forEach(item => {


      if (index == 0) {
        this.bonus.campaignBonus.emailBonus = type[index].active;
        this.setValueInService();
      } else if (index == 1) {
        this.bonus.campaignBonus.birthdayBonus = type[index].active;
        this.setValueInService();
      } else {
        this.bonus.campaignBonus.cardBonus = type[index].active;
        this.setValueInService();
      }


    });
  }

  changeDiscountRateStatus() {

    this.changeDiscountRateStatusValue ? this.changeDiscountRateStatusValue = false : this.changeDiscountRateStatusValue = true;

    this.bonus.campaignBonus.allItemsDiscount = this.changeDiscountRateStatusValue;
    this.setValueInService();
  }

  changeCommissionRateStatus() {
    this.changeCommissionRateStatusValue ? this.changeCommissionRateStatusValue = false : this.changeCommissionRateStatusValue = true;
    this.bonus.campaignBonus.allItemsCommission = this.changeCommissionRateStatusValue;
    this.setValueInService();
  }

  changeValuePartner(event) {
    this.attachMenuItem = event.menuItemDto;
    this.selectedValuePartner = event;
    this.bonus.campaignBonus.partner.id = event.id;
    this.attachMenu = [];
    this.bonusPartnerValidator = false;
    this.setValueInService();
  }


//  calendar function state start


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
        this.bonus.campaignBonus.startDate = this[status];
        this.setValueInService();
      } else {
        this.bonus.campaignBonus.endDate = this[status];
        this.setValueInService();
      }

    }, 1500);
  }

//  calendar function state end

  setValueInService() {


    if (this.bonus.campaignBonusPercentageMenuItem.length > 0) {
      this.campaignManagementService.bonusValidator.menuItem = this.bonus.campaignBonusPercentageMenuItem.length.toString();
    }
    this.campaignManagementService.bonusValidator.partnerValue = this.bonus.campaignBonus.partner.id;
    this.campaignManagementService.bonus.campaignBonus = this.bonus.campaignBonus;
    this.campaignManagementService.bonus.campaignBonusPercentageMenuItem = this.bonus.campaignBonusPercentageMenuItem;
    // console.log(this.campaignManagementService.bonus)
  }

  getAndSetValueForInput(value?, type?, index?) {
    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      if (type == 'discountRate') {
        for (let i = 0; i < this.bonus.campaignBonusPercentageMenuItem.length; i++) {
          this.bonus.campaignBonusPercentageMenuItem[i].discountPercentage = value;
        }
      } else if (type == 'commissionRate') {
        for (let i = 0; i < this.bonus.campaignBonusPercentageMenuItem.length; i++) {
          this.bonus.campaignBonusPercentageMenuItem[i].commissionPercentage = value;
        }
      }
      
      if (this.bonus.campaignBonus.bonusWithPercent.length == 0){
        this.bonusWithUnit.nativeElement.disabled = false
    }

      if (this.bonus.campaignBonus.bonusWithUnit.length == 0){
        this.bonusWithPercent.nativeElement.disabled = false
      }

    this.setValueInService();

    }, 500);
  }

  setInputValueEveryItem(value, id, type) {
    let arrayItems = this.bonus.campaignBonusPercentageMenuItem;


    if (this.valueGetCampaignById) {
      for (let i = 0; i < this.valueGetCampaignById.campaignBonusPercentageMenuItem.length; i++) {
        if (this.valueGetCampaignById.campaignBonusPercentageMenuItem[i]['id'] === id && type === 'commissionRate') {
          this.bonus.campaignBonusPercentageMenuItem[i].commissionPercentage = value;
          this.setValueInService();
        } else if (this.valueGetCampaignById.campaignBonusPercentageMenuItem[i]['id'] === id && type === 'discountRate') {
          this.bonus.campaignBonusPercentageMenuItem[i].discountPercentage = value;
          this.setValueInService();
        }
      }

    } else {
      for (let i = 0; i < arrayItems.length; i++) {
        if (arrayItems[i].menuItem.id == id && type === 'commissionRate') {
          this.bonus.campaignBonusPercentageMenuItem[i].commissionPercentage = value;
          this.setValueInService();
        } else if (arrayItems[i].menuItem.id == id && type === 'discountRate') {
          this.bonus.campaignBonusPercentageMenuItem[i].discountPercentage = value;
          this.setValueInService();
        }

      }
    }
  }


  getValueForInput(event, type) {
    if (type === 'Bonus for Adding Email Address') {
      this.bonus.campaignBonus.bonusForEmail = event;
      this.bonus.campaignBonus.emailBonus = true;
      this.setValueInService();
    } else if (type === 'Bonus for Adding Birthday Date') {
      this.bonus.campaignBonus.bonusForBDay = event;
      this.bonus.campaignBonus.birthdayBonus = true;
      this.setValueInService();
    } else if (type === 'Bonus for Adding Credit Card') {
      this.bonus.campaignBonus.bonusForCreditCard = event;
      this.bonus.campaignBonus.cardBonus = true;
      this.setValueInService();
    }

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      this.setValueInService();

    }, 1500);
  }

  compareToObject() {

    let id = this.bonusUpdateTempObject.campaignBonus['partner'].id;
    if (_.isEqual(this.bonus, this.bonusUpdateTempObject)) {
    } else {
      this.bonus = JSON.parse(JSON.stringify(this.bonusUpdateTempObject));
      this.bonus.campaignBonus.partner = {id: id};
       if (this.bonus.campaignBonus.moreThanOrders == null) {
         this.bonus.campaignBonus.moreThanOrders = '';
       }

       if (this.bonus.campaignBonus.everyOrders == null) {
         this.bonus.campaignBonus.everyOrders = '';
       }

       this.bonus.campaignBonusPercentageMenuItem = []
       for (let i = 0; i < this.bonusUpdateTempObject.campaignBonusPercentageMenuItem.length; i++) {
         this.bonus.campaignBonusPercentageMenuItem.push(
           {
             // id: this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[i].id,
             'commissionPercentage': this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[i].commissionPercentage,
             'discountPercentage':  this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[i].discountPercentage,
             'menuItem': {
               'id':  this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[i]['menuItemId']
             }
           }
         );
       }
      this.setValueInService();
    }

  }


  setValueInUpdate() {
   // console.log(this.valueGetCampaignById)
    this.bonusUpdateTempObject.campaignBonus = this.valueGetCampaignById['campaignBonus'];
    this.bonusUpdateTempObject.campaignBonusPercentageMenuItem = this.valueGetCampaignById['campaignBonusPercentageMenuItem'];

    this.changeCommissionRateStatusValue = this.valueGetCampaignById.campaignBonus.allItemsCommission;
    this.changeDiscountRateStatusValue = this.valueGetCampaignById.campaignBonus.allItemsDiscount;
    this.personalBonuses[0].active = this.valueGetCampaignById.campaignBonus.emailBonus;
    this.personalBonuses[1].active = this.valueGetCampaignById.campaignBonus.birthdayBonus;
    this.personalBonuses[2].active = this.valueGetCampaignById.campaignBonus.cardBonus;
    this.emailValue = this.valueGetCampaignById.campaignBonus.bonusForEmail;
    this.birthdayValue = this.valueGetCampaignById.campaignBonus.bonusForBDay;
    this.cardValue = this.valueGetCampaignById.campaignBonus.bonusForCreditCard;


    if (this.valueGetCampaignById.campaignBonus.startDate != null) {

      let startTime = this.valueGetCampaignById.campaignBonus.startDate.substring(0, 5);

      this.firstTimeValue = startTime;
    }

    if (this.valueGetCampaignById.campaignBonus.endDate != null) {
      let endTime = this.valueGetCampaignById.campaignBonus.endDate.substring(0, 5);

      this.secondTimeValue = endTime;
    }

    if (this.valueGetCampaignById.campaignBonus.everyOrders) {
      this.orderFee[1].checked = true;
      this.orderFee[0].checked = false;
    }

    if (this.valueGetCampaignById.campaignBonus.moreThanOrders) {
      this.orderFee[0].checked = true;
      this.orderFee[1].checked = false;
    }

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      for (let i = 0; i < this.bonusAttachPartners.length; i++) {
        if (this.bonusAttachPartners[i].id == this.valueGetCampaignById.campaignBonus.partner.id) {
          this.partnerValue = this.bonusAttachPartners[i];
          this.attachMenu = this.bonusUpdateTempObject.campaignBonusPercentageMenuItem;
          this.attachMenuItem = this.bonusAttachPartners[i]['menuItemDto'];

        }
      }
      for (let key of this.attachMenu) {
        key.name = key.menuItemName;
        delete key.menuItemName;

      }

      for (let i = 0; i < this.partnerValue.menuItemDto.length; i++) {
        for (let j = 0; j < this.bonusUpdateTempObject.campaignBonusPercentageMenuItem.length; j++) {
          this.commissionPercentage = this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[j].commissionPercentage;
          this.discountPercentage = this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[j].discountPercentage;
          if (this.partnerValue.menuItemDto[i].id === this.bonusUpdateTempObject.campaignBonusPercentageMenuItem[j].menuItemId) {
            this.attachMenu[j].menuName = this.partnerValue.menuItemDto[i].menuName;

          }
        }
      }
      this.compareToObject();
    }, 1500);
  }

  ngDoCheck(): void {
// console.log(this.campaignManagementService.bonusValidator)
    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.bonusValidator.partnerValue == '') {
        this.bonusPartnerValidator = true;
      } else {
        this.bonusPartnerValidator = false;
      }

      if (this.campaignManagementService.bonusValidator.menuItem == '') {
        this.bonusMenuItemValidator = true;
      } else {
        this.bonusMenuItemValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }
  }
}
