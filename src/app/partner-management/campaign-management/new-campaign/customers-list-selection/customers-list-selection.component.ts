import {Component, DoCheck, OnInit} from '@angular/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocompleteSelectedEvent} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormControl} from '@angular/forms';
import {CampaignManagementService} from '../../../../services/campaign-management/campaign-management.service';
import {ActivatedRoute} from '@angular/router';
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
  selector: 'app-customers-list-selection',
  templateUrl: './customers-list-selection.component.html',
  styleUrls: ['./customers-list-selection.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class CustomersListSelectionComponent implements OnInit, DoCheck {


  allCheckedValue = false;
  registrationDateChecked = false;
  birthDayDateChecked = false;
  corporateClientChecked = false;
  labelChecked = false;
  setTimeOutFunctionCall;
  timePeriodIndex = 0; // checked time period index.
  corporateClientArray: any = [];
  label: any = [];
  changeDiscountRateStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  firstTimeValue: any = ''; // start time value.
  firstTimeValueBirthDay: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  secondTimeValueBirthDay: any = ''; // end time value.
  valueGetCampaignById: any = {};
  corporateTypeValue;
  labelValue;
  //calendar variabals
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  date3 = new FormControl(moment()); // form for end time material input.
  date4 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  startDateBirthDay: any; // start date value.
  startDateFinal: any; // start date value.
  startDateFinalBirthDay: any; // start date value.
  endDate: any; // end date value.
  endDateBirthDay: any; // end date value.
  endDateFinal: any; // end date value.
  endDateFinalBirthDay: any; // end date value.
  firstTime = false; // start time input underline stile.
  firstTimeBirthDay = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.
  secondTimeBirthDay = false; // end time input underline stile.
  newTimeStart: any;
  newTimeStartBirthDay: any;
  newTimeEnd: any;
  newTimeEndBirthDay: any;
  startHourOne;
  startHourOneBirthDay;
  startHourTwo;
  startHourTwoBirthDay;
  startMinOne;
  startMinOneBirthDay;
  startMinTwo;
  startMinTwoBirthDay;
  idCampaign;
  endDateFinalTemp;
  startDateFinalTemp;
  tempCampaignCustomersUpdateObject: any = {};
  regDateValidator = false;
  birthdayDateValidator = false;
  corporateClientValidator = false;
  labelValidator = false;
  campaignCustomers = {
    allEvent: false,
    birthDayDateEvent: false,
    birthdayEndDate: '',
    birthdayStartDate: '',
    corporateClient: {
      id: null
    },
    corporateClientEvent: false,
    label: {
      id: null
    },
    labelEvent: false,
    regDateEvent: false,
    registrationEndDate: '',
    registrationStartDate: ''
  };

  otherCustomersObject = {
    allEvent: false,
    birthDayDateEvent: false,
    corporateClientEvent: false,
    labelEvent: false,
    regDateEvent: false
  };


  constructor(private campaignManagementService: CampaignManagementService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getAllCorporateClientList();
    this.getAllLabelList();
    this.idCampaign = this.route.snapshot.paramMap.get('id');

    if (this.idCampaign && !this.campaignManagementService.changeCampaignTypeStatus) {
      this.getCampaignById();
    }
    this.campaignManagementService.changeCampaignTypeStatus = false;
  }


  compareToObject() {
    let idClient;
    let idLabel;
    if (_.isEqual(this.otherCustomersObject, this.valueGetCampaignById)) {

    } else {
      this.otherCustomersObject = this.valueGetCampaignById;

      if (this.tempCampaignCustomersUpdateObject.corporateClient !== null) {
        idClient = this.tempCampaignCustomersUpdateObject.corporateClient.id;
        this.otherCustomersObject['corporateClient'] = {id: idClient};
      }

      if (this.tempCampaignCustomersUpdateObject.label !== null) {
        idLabel = this.tempCampaignCustomersUpdateObject.label.id;
        this.otherCustomersObject['label'] = {id: idLabel};
      }

      for (let item in this.otherCustomersObject) {
        if (this.otherCustomersObject[item] == null) {
          delete this.otherCustomersObject[item];
        }
      }
      this.setValueInService();

    }

  }

  getCampaignById() {
    this.campaignManagementService.getCampaignById(this.idCampaign).subscribe(res => {

      let type = '';
      if (res['campaignDto']['campaign']['campaignType'] == 'COMBO_SET') {
        type = 'comboSet';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'DISCOUNT') {
        type = 'discount';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'BONUS') {
        type = 'campaignBonus';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'FREE_ITEM') {
        type = 'freeItem';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'VOUCHER') {
        type = 'voucher';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'OUT_OF_SCHEDULE') {
        type = 'outOfSchedule';
      } else if (res['campaignDto']['campaign']['campaignType'] == 'PROMO_CODE') {
        type = 'promoCode';
      }
      this.tempCampaignCustomersUpdateObject = res[type];
      // this.valueGetCampaignById = res[type];
      this.valueGetCampaignById['allEvent'] = res[type]['allEvent'];
      this.valueGetCampaignById['birthDayDateEvent'] = res[type]['birthDayDateEvent'];
      this.valueGetCampaignById['birthDayDateEvent'] = res[type]['birthDayDateEvent'];
      this.valueGetCampaignById['birthdayEndDate'] = res[type]['birthdayEndDate'];
      this.valueGetCampaignById['birthdayStartDate'] = res[type]['birthdayStartDate'];
      this.valueGetCampaignById['corporateClient'] = res[type]['corporateClient'];
      this.valueGetCampaignById['corporateClientEvent'] = res[type]['corporateClientEvent'];
      this.valueGetCampaignById['label'] = res[type]['label'];
      this.valueGetCampaignById['labelEvent'] = res[type]['labelEvent'];
      this.valueGetCampaignById['regDateEvent'] = res[type]['regDateEvent'];
      this.valueGetCampaignById['registrationEndDate'] = res[type]['registrationEndDate'];
      this.valueGetCampaignById['registrationStartDate'] = res[type]['registrationStartDate'];


      clearTimeout(this.setTimeOutFunctionCall);
      this.setTimeOutFunctionCall = setTimeout(() => {
        this.allCheckedValue = this.valueGetCampaignById.allEvent;
        this.registrationDateChecked = this.valueGetCampaignById.regDateEvent;
        this.birthDayDateChecked = this.valueGetCampaignById.birthDayDateEvent;
        this.labelChecked = this.valueGetCampaignById.labelEvent;

        this.corporateClientChecked = this.valueGetCampaignById.corporateClientEvent;
        if (this.valueGetCampaignById.registrationStartDate != null) {
          this.startDate = new Date(this.valueGetCampaignById.registrationStartDate);
          this.endDate = new Date(this.valueGetCampaignById.registrationEndDate);
          let startTime = this.valueGetCampaignById.registrationStartDate.substring(10, 16);
          let endTime = this.valueGetCampaignById.registrationEndDate.substring(10, 16);
          this.firstTimeValue = startTime;
          this.secondTimeValue = endTime;

        }
        if (this.valueGetCampaignById.birthdayStartDate) {
          this.startDateBirthDay = new Date(this.valueGetCampaignById.birthdayStartDate);
          this.endDateBirthDay = new Date(this.valueGetCampaignById.birthdayEndDate);
          let secondTimeValueBirthDay = this.valueGetCampaignById.birthdayEndDate.substring(10, 16);

          let firstTimeValueBirthDay = this.valueGetCampaignById.birthdayStartDate.substring(10, 16);
          this.firstTimeValueBirthDay = firstTimeValueBirthDay;

          this.secondTimeValueBirthDay = secondTimeValueBirthDay;


        }


        if (this.valueGetCampaignById.corporateClient) {
          for (let i = 0; i < this.corporateClientArray.length; i++) {
            if (this.corporateClientArray[i].id == this.valueGetCampaignById.corporateClient.id) {
              this.corporateTypeValue = this.corporateClientArray[i];
            }
          }
        }


        if (this.valueGetCampaignById.label) {
          for (let i = 0; i < this.label.length; i++) {
            if (this.label[i].id == this.valueGetCampaignById.label.id) {
              this.labelValue = this.label[i];
            }
          }
        }
        this.compareToObject();
      }, 1200);

    });
  }

  getAllCorporateClientList() {
    this.campaignManagementService.getAllCorporateClients().subscribe(res => {

      if (res) {
        this.corporateClientArray = res;
      }
    });
  }

  getAllLabelList() {
    this.campaignManagementService.getAllLabels().subscribe(res => {
      if (res) {
        this.label = res;
      }
    });
  }

  getStatusCheckBox(checkValue, type, statusCheck) {
    // this.campaignCustomers[type] = checkValue;
    this.otherCustomersObject[type] = checkValue;
    this[statusCheck] = checkValue;

    if (type == 'regDateEvent' && checkValue == true) {
      this.campaignManagementService.customersListValidator.regDateBoolean = checkValue;
    } else if (type == 'regDateEvent' && checkValue == false) {
      this.campaignManagementService.customersListValidator.regDateBoolean = '';
      this.firstTimeValue = '';
      this.secondTimeValue = '';
      this.startDate = '';
      this.endDate = '';
    }


    if (type == 'birthDayDateEvent' && checkValue == true) {
      this.campaignManagementService.customersListValidator.birthDayBoolean = checkValue;
    } else if (type == 'birthDayDateEvent' && checkValue == false) {
      this.campaignManagementService.customersListValidator.birthDayBoolean = '';
      this.startDateBirthDay = '';
      this.endDateBirthDay = '';
      this.firstTimeValueBirthDay = '';
      this.secondTimeValueBirthDay = '';

    }


    if (type == 'corporateClientEvent' && checkValue == true) {
      this.campaignManagementService.customersListValidator.corporateBoolean = checkValue;
    } else if (type == 'corporateClientEvent' && checkValue == false) {
      this.campaignManagementService.customersListValidator.corporateBoolean = '';
      this.corporateTypeValue = '';
    }

    if (type == 'labelEvent' && checkValue == true) {
      this.campaignManagementService.customersListValidator.labelBoolean = checkValue;
    } else if (type == 'labelEvent' && checkValue == false) {
      this.campaignManagementService.customersListValidator.labelBoolean = '';
      this.labelValue = '';
    }


    if (this.registrationDateChecked == true && this.birthDayDateChecked == true && this.corporateClientChecked == true && this.labelChecked == true) {
      this.allCheckedValue = true;
      this.setValueInService();
    } else {
      this.allCheckedValue = false;
      this.setValueInService();
    }
    this.setValueInService();
  }

  getStatusCheckBoxAll(checkValue, type, statusCheck) {

    // this.campaignCustomers[type] = checkValue;
    this.otherCustomersObject[type] = checkValue;
    this[statusCheck] = checkValue;

    if (this.allCheckedValue == true) {
      this.registrationDateChecked = true;
      this.birthDayDateChecked = true;
      this.corporateClientChecked = true;
      this.labelChecked = true;
      this.setValueInService();
    } else {
      this.registrationDateChecked = false;
      this.birthDayDateChecked = false;
      this.corporateClientChecked = false;
      this.labelChecked = false;
      this.setValueInService();
    }
  }

  setValueInService() {
    this.campaignManagementService.customersListSelection = this.otherCustomersObject;
  }


  changeValueSelectOption(event, type, id) {
    this.campaignCustomers[type][id] = event;

    if (type == 'label') {
      this.campaignManagementService.customersListValidator.label = event;
      this.otherCustomersObject['label'] = {id: event};
    }

    if (this.campaignCustomers.label.id !== null) {
      this.labelValidator = false;
    }

    if (type == 'corporateClient') {
      this.campaignManagementService.customersListValidator.corporateClient = event;
      this.otherCustomersObject['corporateClient'] = {id: event};
    }

    if (this.campaignCustomers.corporateClient.id !== null) {
      this.corporateClientValidator = false;
    }


    this.setValueInService();
  }


//  calendar function state start

  // get date from mat date input.
  getDate(event, status) {
    let year, month, day;
    this[status] = event.value['_d'];
    year = this[status].getFullYear();
    month = this[status].getMonth() + 1;
    day = this[status].getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    if (status === 'startDate') {
      this.startDateFinal = year + '-' + month + '-' + day;
    } else if (status === 'endDate') {
      this.endDateFinal = year + '-' + month + '-' + day;
      this.parseDateJsonFormatStart();
    } else if (status === 'endDateBirthDay') {
      this.endDateFinalBirthDay = year + '-' + month + '-' + day;
      this.parseDateJsonFormatStart();
    } else if (status === 'startDateBirthDay') {
      this.startDateFinalBirthDay = year + '-' + month + '-' + day;
      this.parseDateJsonFormatStart();
    }

    if (event.value) {
      this.parseDateJsonFormatStart();
    }
  }

  parseDateJsonFormatStart() {
    if (this.newTimeStart && this.startDate !== undefined) {
      this.startDateFinal = this.startDateFinal.slice(0, 11);
      this.startDateFinal = this.startDateFinal + ' ' + this.newTimeStart;
      this.startDateFinalTemp = this.startDateFinal;
      // this.campaignCustomers.registrationStartDate = this.startDateFinal;
      this.campaignManagementService.customersListValidator.regDate = this.startDateFinal;
      this.otherCustomersObject['registrationStartDate'] = this.startDateFinal;
      this.setValueInService();
    }


    if (this.newTimeStartBirthDay && this.startDate !== undefined) {
      this.startDateFinalBirthDay = this.startDateFinalBirthDay.slice(0, 11);
      this.startDateFinalBirthDay = this.startDateFinalBirthDay + ' ' + this.newTimeStartBirthDay;
      // this.campaignCustomers.birthdayStartDate = this.startDateFinalBirthDay;
      this.otherCustomersObject['birthdayStartDate'] = this.startDateFinalBirthDay;
      this.campaignManagementService.customersListValidator.birthDate = this.startDateFinalBirthDay;
    }

    if (this.endDateFinal !== undefined  && this.newTimeEnd !== undefined) {
      if (this.newTimeEnd.length !== 22) {
        this.endDateFinal = this.endDateFinal.slice(0, 11);
        this.endDateFinal = this.endDateFinal + ' ' + this.newTimeEnd;
        // this.campaignCustomers.registrationEndDate = this.endDateFinal;
        this.otherCustomersObject['registrationEndDate'] = this.endDateFinal;
        this.endDateFinalTemp = this.endDateFinal;
        this.campaignManagementService.customersListValidator.regDate += this.endDateFinal;
        this.setValueInService();
      }
    }

    if (this.endDateFinalBirthDay !== undefined && this.newTimeEndBirthDay !== undefined) {
      if (this.newTimeEndBirthDay.length !== 22) {
        this.endDateFinalBirthDay = this.endDateFinalBirthDay.slice(0, 11);
        this.endDateFinalBirthDay = this.endDateFinalBirthDay + ' ' + this.newTimeEndBirthDay;
        // this.campaignCustomers.birthdayEndDate = this.endDateFinalBirthDay;
        this.otherCustomersObject['birthdayEndDate'] = this.endDateFinalBirthDay;
        this.campaignManagementService.customersListValidator.birthDate += this.endDateFinalBirthDay;
      }
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
    } else if (status === 'secondTimeBirthDay') {
      if (this.secondTimeValueBirthDay.length < 5) {
        this.secondTimeValueBirthDay = '00:00';
      }
    } else if (status === 'firstTimeBirthDay') {
      if (this.firstTimeValueBirthDay.length < 5) {
        this.firstTimeValueBirthDay = '00:00';
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

  // clear keypress validation for time inputs.
  clearTimeDada(event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }


  // change time format to correct format.
  changeTimeFormat(value, status) {
    let time, hour, min, sec = '00', milSec = '00';

    this[status] = value;

    if (value.length === 2) {
      if (value * 1 > 23) {
        this[status] = '23';
      }
      if (status === 'firstTimeValue') {
        this.startHourOne = this[status];

      } else {
        this.startHourTwo = this[status];

      }

      if (status === 'firstTimeValueBirthDay') {
        this.startHourOneBirthDay = this[status];

      } else {
        this.startHourTwoBirthDay = this[status];

      }


      this[status] += ':';
    } else if (value.length === 5) {
      let string = value;

      const minutes = (string[3] + string[4] * 1);

      if (status === 'firstTimeValue') {
        this.startMinOne = minutes;
        this.newTimeStart = this.startHourOne + ':' + this.startMinOne + ':' + sec + ':' + milSec;

      } else {
        this.startMinTwo = minutes;
        this.newTimeEnd = this.startHourTwo + ':' + this.startMinTwo + ':' + sec + ':' + milSec;
      }

      if (status === 'firstTimeValueBirthDay') {
        this.startMinOneBirthDay = minutes;
        this.newTimeStartBirthDay = this.startHourOneBirthDay + ':' + this.startMinOneBirthDay + ':' + sec + ':' + milSec;

      } else {
        this.startMinTwoBirthDay = minutes;
        this.newTimeEndBirthDay = this.startHourTwoBirthDay + ':' + this.startMinTwoBirthDay + ':' + sec + ':' + milSec;
      }

      if (minutes > 59) {
        string = string[0] + string[1] + ':59';
        this[status] = string;
        if (status === 'firstTimeValue') {

          this.startMinOne = 59;
          this.newTimeStart = this.startHourOne + ':' + this.startMinOne + ':' + sec + ':' + milSec;
        } else {
          this.startMinTwo = 59;
          this.newTimeEnd = this.startHourTwo + ':' + this.startMinTwo + ':' + sec + ':' + milSec;
        }

        if (status === 'firstTimeValueBirthDay') {

          this.startMinOneBirthDay = 59;
          this.newTimeStartBirthDay = this.startHourOneBirthDay + ':' + this.startMinOneBirthDay + ':' + sec + ':' + milSec;
        } else {
          this.startMinTwoBirthDay = 59;
          this.newTimeEndBirthDay = this.startHourTwoBirthDay + ':' + this.startMinTwoBirthDay + ':' + sec + ':' + milSec;
        }

      }
    }

    if (value.length === 5) {
      this.parseDateJsonFormatStart();
    }


  }

//  calendar function state end


  ngDoCheck(): void {


    if (this.campaignManagementService.customersListValidator.regDateBoolean !== '') {

      if (this.campaignManagementService.customersListValidator.regDate.length !== 46) {
        this.regDateValidator = true;
      } else {
        this.regDateValidator = false;
      }
    } else {
      this.regDateValidator = false;
    }


    if (this.campaignManagementService.customersListValidator.birthDayBoolean !== '') {
      if (this.campaignManagementService.customersListValidator.birthDate.length !== 46) {
        this.birthdayDateValidator = true;
      } else {
        this.birthdayDateValidator = false;
      }
    } else {
      this.birthdayDateValidator = false;
    }

    if (this.campaignManagementService.customersListValidator.corporateBoolean !== '') {
      if (this.campaignManagementService.customersListValidator.corporateClient == '') {
        this.corporateClientValidator = true;
      } else {
        this.corporateClientValidator = false;
      }
    } else {
      this.corporateClientValidator = false;
    }


    if (this.campaignManagementService.customersListValidator.labelBoolean !== '') {
      if (this.campaignManagementService.customersListValidator.label == '') {
        this.labelValidator = true;
      } else {
        this.labelValidator = false;
      }
    } else {
      this.labelValidator = false;
    }


  }

}
