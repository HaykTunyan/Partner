import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocompleteSelectedEvent} from '@angular/material';
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
  selector: 'app-out-of-schedule-items',
  templateUrl: './out-of-schedule-items.component.html',
  styleUrls: ['./out-of-schedule-items.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class OutOfScheduleItemsComponent implements OnInit {
  @Input('outOfSchedule') valueGetCampaignById;
  @ViewChild('outOfScheduleAttachMenu') outOfScheduleAttachMenu : ElementRef<HTMLInputElement>
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
  timePeriodIndex = 0; // checked time period index.

  outOfScheduleItemsPartnerList: any = [];
  attachMenuItem: any = [];
  discountRate;
  deliveryFee;
  changeDiscountRateStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  attachMenu = [];
  selectedValuePartner = this.outOfScheduleItemsPartnerList[0];
  newDate = new Date();
  startDateJson;
  endDateJson;
  partnerValue;

  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.


  //calendar variabals
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  outOfSchedulePartnerValidator = false
  outOfScheduleMenuItemValidator = false

  outOfScheduleItemsUpdate = {};
  outOfScheduleItems = {
    'campaignPartnerType': 'BRAND',
    'startDate': '',
    'endDate': '',
    'menuItemSet': [],
    'partner': {
      'id': ''
    }
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
    this.campaignManagementService.getAllPartnersList().subscribe(res => {
      this.outOfScheduleItemsPartnerList = res;
    });
  }

  setValueInService() {
    this.campaignManagementService.outOfSchedule.outOfSchedule = this.outOfScheduleItems;

    this.campaignManagementService.outOfScheduleValidator.partnerValue = this.outOfScheduleItems.partner.id

    if (this.outOfScheduleItems.menuItemSet.length > 0){
      this.campaignManagementService.outOfScheduleValidator.menuItem =this.outOfScheduleItems.menuItemSet.length.toString()
    }

  }

  outOfScheduleItemsRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'discountType') {
      this.outOfScheduleItems.campaignPartnerType = type[index].value;
      this.setValueInService();
    }


    this.timePeriodIndex = index;
    // this.setValueInService();
  }


  remove(name: string): void {

    for (let i = 0; i < this.attachMenu.length; i++) {
      if (this.attachMenu[i]['name'] == name) {
        this.attachMenu.splice(i, 1);
        this.outOfScheduleItems.menuItemSet = [];
        for (let i = 0; i < this.attachMenu.length; i++) {
          this.outOfScheduleItems.menuItemSet.push(
            {
              id: this.attachMenu[i].id
            }
          );

        }

      }
    }

    if (this.attachMenu.length == 0){
      this.outOfScheduleMenuItemValidator = true
    }
    this.setValueInService();


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.attachMenu.push(event.option.value);
    this.outOfScheduleItems.menuItemSet = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.outOfScheduleItems.menuItemSet.push(
        {
          id: this.attachMenu[i].id
        }
      );

    }

    this.outOfScheduleMenuItemValidator = false
    this.setValueInService();
    this.outOfScheduleAttachMenu.nativeElement.blur()
  }


  changeValuePartner(event) {
    this.selectedValuePartner = event;
    this.attachMenuItem = event.menuItemDto;
    this.outOfScheduleItems.partner.id = event.id;
    this.attachMenu = []
    this.outOfSchedulePartnerValidator = false
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
        this.outOfScheduleItems.startDate = this[status];
        this.setValueInService();
      } else {
        this.outOfScheduleItems.endDate = this[status];
        this.setValueInService();
      }

    }, 1000);

  }

//  calendar function state end

  compareToObject() {

    /*  outOfScheduleItems = {


        'campaignPartnerType': 'BRAND',
        'startDate': '',
        'endDate': '',
        'menuItemSet': [],
        'partner': {
          'id': ''

        }
      };*/

    let id = this.outOfScheduleItemsUpdate['partner'].id;
    if (_.isEqual(this.outOfScheduleItems, this.outOfScheduleItemsUpdate)) {
    } else {
      // this.comboSet =JSON.parse(JSON.stringify(this.tempComboSetObject)) ;
      this.outOfScheduleItems = JSON.parse(JSON.stringify(this.outOfScheduleItemsUpdate));

      this.outOfScheduleItems.partner = {id: id};
      this.outOfScheduleItems.campaignPartnerType = this.outOfScheduleItemsUpdate['campaignPartnerType'];
      this.outOfScheduleItems.startDate = this.outOfScheduleItemsUpdate['startDate']
      this.outOfScheduleItems.endDate = this.outOfScheduleItemsUpdate['endDate']
      this.outOfScheduleItems.menuItemSet = []
      for (let i = 0; i <this.outOfScheduleItemsUpdate['menuItemSet'].length ; i++) {
        this.outOfScheduleItems.menuItemSet.push({id:this.outOfScheduleItemsUpdate['menuItemSet'][i]['id']})
      }

      this.setValueInService();
    }

  }

  setValueInUpdate() {
   // console.log(this.valueGetCampaignById)
    this.outOfScheduleItemsUpdate = this.valueGetCampaignById.outOfSchedule;
    for (let i = 0; i < this.discountType.length; i++) {
      if (this.discountType[i].value === this.outOfScheduleItemsUpdate['campaignPartnerType'] && i === 0) {
        this.discountType[0].checked = true;
        this.discountType[1].checked = false;
      } else if (this.discountType[i].value === this.outOfScheduleItemsUpdate['campaignPartnerType'] && i === 1) {
        this.discountType[1].checked = true;
        this.discountType[0].checked = false;
      }
    }


    if (this.outOfScheduleItemsUpdate['startDate'] != null) {

      let startTime = this.outOfScheduleItemsUpdate['startDate'].substring(0, 5);

      this.firstTimeValue = startTime;
    }

    if (this.outOfScheduleItemsUpdate['endDate'] != null) {
      let endTime = this.outOfScheduleItemsUpdate['endDate'].substring(0, 5);

      this.secondTimeValue = endTime;
    }


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {


      for (let i = 0; i < this.outOfScheduleItemsPartnerList.length; i++) {
        if (this.outOfScheduleItemsPartnerList[i].id == this.outOfScheduleItemsUpdate['partner'].id) {
          this.partnerValue = this.outOfScheduleItemsPartnerList[i];
          this.attachMenu = this.outOfScheduleItemsUpdate['menuItemSet'];
          this.attachMenuItem = this.outOfScheduleItemsPartnerList[i]['menuItemDto'];
        }
      }


      for (let i = 0; i < this.attachMenu.length; i++) {
        this.attachMenu[i].menuName = this.attachMenu[i].menu.name;
      }

      this.compareToObject();
    }, 1000);
  }


  ngDoCheck(): void {

    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.outOfScheduleValidator.partnerValue == '') {
        this.outOfSchedulePartnerValidator = true;
      } else {
        this.outOfSchedulePartnerValidator = false;
      }

      if (this.campaignManagementService.outOfScheduleValidator.menuItem == '') {
        this.outOfScheduleMenuItemValidator = true;
      } else {
        this.outOfScheduleMenuItemValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }
  }
}
