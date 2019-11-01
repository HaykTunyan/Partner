import {ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {CampaignManagementService} from '../../../services/campaign-management/campaign-management.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

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
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NewCampaignComponent implements OnInit, DoCheck {

  modalDivConfirmStatus = false;
  changeTypeCampaign = false;
  campaignEvent;
  errorShow = true;
  hourlyBlock = false; // is hourly additional box open or close.
  engNameValidator = false;
  descriptionValidator = false;
  campaignTypeValidator = false;
  calendarValidator = false;
  rusValue = '';
  armValue = '';
  description = '';
  validatorArray = [{'engNameValidator': true}];

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

  selectedCampaignType;
  // new user data object.
  statusCampaign = false;
  newCampaignEventTypeArray = [
    {
      name: 'Yes',
      checked: false
    },
    {
      name: 'No',
      checked: true
    }
  ]; // array of backup period checkboxes.
  valueGetCampaignById: any;
  timePeriodIndex = 0; // checked time period index.
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  startDateFinal: any; // start date value.
  endDate: any; // end date value.
  endDateFinal: any; // end date value.
  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.
  setTimeOutFunctionCall;
  tempUpdateCampaignValue: any;
  startHourOne;
  startHourTwo;
  startMinOne;
  startMinTwo;
  newTimeStart: any;
  newTimeEnd: any;
  firstTime = false;
  secondTime = false; // end time input underline stile.
  idCampaign;
  valids = false;
  campaignVelue = '';
  campaignTempVelue = '';
  campaignDto = {
    'campaign': {
      'campaignEvent': 'NO',
      'campaignType': '',
      'description': '',
      'end date': '',
      'isDisable': true,
      'name': '',
      'start date': ''
    },
    'campaignTranslateDtoList': []
  };

  constructor(
    private campaignService: CampaignManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.idCampaign = this.route.snapshot.paramMap.get('id');
    if (this.idCampaign) {
     // console.log(this.idCampaign);
      this.getCampaignById();
    } else {
     // console.log(this.idCampaign);
    }
  }

  valid() {

    if (this.campaignService.validatorArray[0].engName == '') {
      this.engNameValidator = true;
    } else {
      this.engNameValidator = false;
    }

    if (this.campaignService.validatorArray[0].description == '') {
      this.descriptionValidator = true;
    } else {
      this.descriptionValidator = false;
    }

    if (this.campaignService.validatorArray[0].campaignType == '') {
      this.campaignTypeValidator = true;
    } else {
      this.campaignTypeValidator = false;
    }

    if (this.campaignService.validatorArray[0].date.length !== 46) {
      this.calendarValidator = true;
    } else {
      this.calendarValidator = false;
    }
    if (this.selectedCampaignType == 'DISCOUNT') {
      if (this.campaignService.discountOrDeliveryValidatorArray[0].deliveryFee == ''
        || this.campaignService.discountOrDeliveryValidatorArray[0].discountRate == ''
        && this.campaignService.discountOrDeliveryValidatorArray[0].everyItemSetValue == '') {
        this.valids = false;
      } else {
        this.valids = true;
      }
      if (this.campaignService.discountOrDeliveryValidatorArray[0].partnerValue == '') {
        this.valids = false;
      } else {
        this.valids = true;
      }
      if (this.campaignService.discountOrDeliveryValidatorArray[0].menuItem == '') {
        this.valids = false;
      } else {
        this.valids = true;
      }
    }

    if (this.selectedCampaignType == 'COMBO_SET') {
      // console.log(this.campaignService.comboSetValidator)
      this.campaignService.saveButtonClick++;
        for (let key in this.campaignService.comboSetValidator) {
          if (this.campaignService.comboSetValidator[key] == '') {
            this.valids = false;
            return;
          }
          this.valids = true;
        }

      // console.log(this.valids)
    }

    if (this.selectedCampaignType === 'BONUS') {
      this.campaignService.saveButtonClick++;
      for (let key in this.campaignService.bonusValidator) {
        if (this.campaignService.bonusValidator[key] == '') {
          this.valids = false;
          return;
        }
        this.valids = true;

      }
    }

    if (this.selectedCampaignType === 'FREE_ITEM') {
      this.campaignService.saveButtonClick++;
      for (let key in this.campaignService.freeItemValidator) {
        if (this.campaignService.freeItemValidator[key] == '') {
          this.valids = false;
          return;
        }
        this.valids = true;
      }


    }

    if (this.selectedCampaignType === 'SPONSORED_PARTNER_ITEMS') {

      this.campaignService.saveButtonClick++;
      for (let key in this.campaignService.sponsoredValidator) {
        if (this.campaignService.sponsoredValidator[key] == '') {
          this.valids = false;
          return;
        }
        this.valids = true;

      }

    }

    if (this.selectedCampaignType === 'OUT_OF_SCHEDULE') {

      this.campaignService.saveButtonClick++;
      for (let key in this.campaignService.outOfScheduleValidator) {
        if (this.campaignService.outOfScheduleValidator[key] == '') {
          this.valids = false;
          return;
        }
        this.valids = true;
      }
    }

    if (this.selectedCampaignType === 'PROMO_CODE') {

      this.campaignService.saveButtonClick++;
      for (let key in this.campaignService.promoCodeValidator) {
        if (this.campaignService.promoCodeValidator[key] == '') {
          this.valids = false;
          return;
        }
        this.valids = true;
      }
    }
    if (this.selectedCampaignType === 'VOUCHER') {
      this.valids = true;
    }

    let tempArray = [];
    for (let key in this.campaignService.customersListValidator) {
      if (key == 'regDateBoolean' || key == 'birthDayBoolean' || key == 'corporateBoolean' || key == 'labelBoolean') {
        if (this.campaignService.customersListValidator[key] == '') {
          tempArray.push(this.campaignService.customersListValidator[key]);
        }

      }
    }

    if (tempArray.length === 4) {
      this.valids = true;
    } else if (this.campaignService.customersListValidator.regDateBoolean !== '' && this.campaignService.customersListValidator.regDate !== '') {
      this.valids = true;
    }


    this.campaignService.saveButtonClick++;
    this.saveCampaign();
  }

  getInputValue(value = undefined, type = undefined) {

    this[type] = value;

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      if (this.campaignDto.campaign.name !== '') {
        this.engNameValidator = false;
      }
      if (this.campaignDto.campaign.description !== '') {
        this.descriptionValidator = false;
      }

      if (type == 'ru') {

        if (this.campaignDto.campaignTranslateDtoList.length == 0) {
          this.campaignDto.campaignTranslateDtoList.push(
            {
              'language': {
                'code': 'ru'
              },
              'name': this.rusValue
            }
          );
        } else {
          for (let i = 0; i < this.campaignDto.campaignTranslateDtoList.length; i++) {
            if (this.campaignDto.campaignTranslateDtoList[i]['language']['code'] == 'ru') {
              this.campaignDto.campaignTranslateDtoList[i]['name'] = this.rusValue;
              break;
            } else {
              this.campaignDto.campaignTranslateDtoList[1] =
                {
                  'language': {
                    'code': 'ru'
                  },
                  'name': this.rusValue
                };

              break;
            }
          }
        }
      } else if (type == 'arm') {
        if (this.campaignDto.campaignTranslateDtoList.length == 0) {
          this.campaignDto.campaignTranslateDtoList.push(
            {
              'language': {
                'code': 'arm'
              },
              'name': this.armValue

            }
          );
        } else {
          for (let i = 0; i < this.campaignDto.campaignTranslateDtoList.length; i++) {
            if (this.campaignDto.campaignTranslateDtoList[i]['language']['code'] == 'arm') {
              this.campaignDto.campaignTranslateDtoList[i]['name'] = this.armValue;
              break;
            } else {
              this.campaignDto.campaignTranslateDtoList[1] =
                {
                  'language': {
                    'code': 'arm'
                  },
                  'name': this.armValue

                };

              break;
            }
          }
        }
      }

      for (let i = 0; i < this.campaignDto.campaignTranslateDtoList.length; i++) {
        if (this.campaignDto.campaignTranslateDtoList[i]['name'] == '') {
          this.campaignDto.campaignTranslateDtoList = this.campaignDto.campaignTranslateDtoList.splice(i - 1, 1);
        }
      }


      this.setValueInService();

    }, 500);
  }


  setValueInService() {
    this.campaignService.newCampaign = this.campaignDto;
    this.campaignService.validatorArray[0].engName = this.campaignDto.campaign.name;
    this.campaignService.validatorArray[0].description = this.campaignDto.campaign.description;
    this.campaignService.validatorArray[0].campaignType = this.campaignDto.campaign.campaignType;

  }


  checkChangeTypeCampaign(id) {
    if (id) {
      this.modalDivConfirmStatus = true;
    }
  }


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
    } else {
      this.endDateFinal = year + '-' + month + '-' + day;
      this.parseDateJsonFormatStart();
    }

    if (event.value) {
      this.parseDateJsonFormatStart();
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

      }
    }
    if (value.length === 5) {
      this.parseDateJsonFormatStart();
    }
  }

  parseDateJsonFormatStart() {
    this.cd.detectChanges();
    if (this.newTimeStart && this.startDate !== undefined) {
      this.cd.detectChanges();
      this.startDateFinal = this.startDateFinal.slice(0, 11);
      this.startDateFinal = this.startDateFinal + ' ' + this.newTimeStart;
      this.campaignDto.campaign['start date'] = this.startDateFinal;
      this.campaignService.newCampaign['campaign']['start date'] = this.startDateFinal;
      this.campaignService.validatorArray[0].date = this.startDateFinal;
    }

    if (this.endDate !== undefined && this.newTimeEnd !== undefined ) {
      this.cd.detectChanges();
      if (this.newTimeEnd.length !== 22) {
        this.endDateFinal = this.endDateFinal.slice(0, 11);
        this.endDateFinal = this.endDateFinal + ' ' + this.newTimeEnd;
        this.campaignDto.campaign['end date'] = this.endDateFinal;
        this.campaignService.newCampaign['campaign']['end date'] = this.endDateFinal;
        this.campaignService.validatorArray[0].date += this.endDateFinal;
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


  compareToObject() {


    if (_.isEqual(this.campaignDto.campaign, this.tempUpdateCampaignValue)) {
    } else {
      this.campaignDto = this.tempUpdateCampaignValue;
      this.setValueInService();
    }

  }

  newCampaignSetEvent(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;

    this.campaignDto.campaign.campaignEvent = type[index].name.toUpperCase();

    this.setValueInService();


    this.timePeriodIndex = index;
  }


  activateNewOrChangeableCampaign() {
    this.statusCampaign ? this.statusCampaign = false : this.statusCampaign = true;
    this.campaignService.newCampaign['isDisable'] = this.statusCampaign;
  }

  cancelAddCampaign() {
    this.router.navigate(['/campaign-management/campaign']);
  }

  /**
   * function for set campaign type
   * @param value --> type campaign
   */
  changeValueCampaignType(value) {
   // console.log('changeValueCampaignType ific araj',this.selectedCampaignType)
    if (this.idCampaign) {
      this.modalDivConfirmStatus = true;
      this.campaignVelue = value;
      this.campaignService.changeCampaignTypeStatus =true
     // console.log('changeValueCampaignType if',this.selectedCampaignType)
     // console.log('changeValueCampaignType if',this.campaignService.changeCampaignTypeStatus)
      /* this.selectedCampaignType = value;
       this.campaignDto.campaign.campaignType = this.selectedCampaignType;
       if (this.campaignDto.campaign.campaignType !== '') {
         this.campaignTypeValidator = false;
       }*/
    } else {
      this.selectedCampaignType = value;
      this.campaignDto.campaign.campaignType = this.selectedCampaignType;
      if (this.campaignDto.campaign.campaignType !== '') {
        this.campaignTypeValidator = false;
      }
    //  console.log('changeValueCampaignType else',this.selectedCampaignType)
    }

    this.setValueInService();
  }

  saveCampaign() {

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      if (this.valids == true) {
        if (this.selectedCampaignType === 'DISCOUNT') {
          if (this.idCampaign) {
            this.campaignService.updateDiscountOrDeliveryCampaign(this.idCampaign).subscribe(res => {
              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addDiscountOrDeliveryCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'COMBO_SET') {

          if (this.idCampaign) {
            this.campaignService.updateComboSetCampaign(this.idCampaign).subscribe(res => {
              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            // console.log(this.valids)
            this.campaignService.addComboSetCampaign().subscribe(res => {
              this.router.navigate(['/campaign-management/campaign']);
            });
          }


        } else if (this.selectedCampaignType === 'BONUS') {

          if (this.idCampaign) {
            this.campaignService.updateBonusCampaign(this.idCampaign).subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addBonusCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'FREE_ITEM') {

          if (this.idCampaign) {
            this.campaignService.updateFreeItemCampaign(this.idCampaign).subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addFreeItemCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'SPONSORED_PARTNER_ITEMS') {

          if (this.idCampaign) {
            this.campaignService.updateSponsoredPartnerItemsCampaign(this.idCampaign).subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addSponsoredPartnerItemsCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'VOUCHER') {

          if (this.idCampaign) {
            this.campaignService.updateVoucherCampaign(this.idCampaign).subscribe(res => {

              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addVoucherCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'OUT_OF_SCHEDULE') {

          if (this.idCampaign) {

            this.campaignService.updateOutOfScheduleItemsCampaign(this.idCampaign).subscribe(res => {

              this.router.navigate(['/campaign-management/campaign']);

            }, error1 => {

            });
          } else {
            this.campaignService.addOutOfScheduleItemsCampaign().subscribe(res => {

              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        } else if (this.selectedCampaignType === 'PROMO_CODE') {

          if (this.idCampaign) {
            this.campaignService.updatePromoCodeCampaign(this.idCampaign).subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          } else {
            this.campaignService.addPromoCodeCampaign().subscribe(res => {


              this.router.navigate(['/campaign-management/campaign']);

            });
          }


        }

        // this.router.navigate(['/campaign-management/campaign']);
        this.campaignService.comboSetValidator = {
          partnerValue: '',
          comboSet: ''
        };
        this.campaignService.discountOrDeliveryValidatorArray = [
          {
            deliveryFee: '',
            discountRate: '',
            everyItemSetValue: '',
            partnerValue: '',
            menuItem: ''
          }
        ];
        this.campaignService.validatorArray = [
          {
            engName: '',
            description: '',
            date: '',
            campaignType: ''
          }
        ];

        this.campaignService.bonusValidator = {
          partnerValue: '',
          menuItem: ''
        };
        this.campaignService.freeItemValidator = {
          partnerValue: '',
          menuItem: '',
          freeItemName: '',
          freeItemImage: '',
          freeItem: ''
        };

        this.campaignService.sponsoredValidator = {
          partnerValue: '',
          menuItem: '',
          serviceType: ''
        };

        this.campaignService.promoCodeValidator = {
          promoCodeName: ''
        };
        this.campaignService.saveButtonClick = 0;
      }


    }, 1000);


  }

  getCampaignById() {
    let validDate;
    this.campaignService.getCampaignById(this.idCampaign).subscribe(res => {
      this.tempUpdateCampaignValue = res['campaignDto'];
      this.valueGetCampaignById = res;
      this.campaignDto.campaign.name = res['campaignDto']['campaign']['name'];
      this.campaignDto.campaign.description = res['campaignDto']['campaign']['description'];
      // this.campaignService.validatorArray = this.campaignService.validatorArray;
      if (res['campaignDto']['campaignTranslateDtoList'].length !== 0) {
        for (let i = 0; i < res['campaignDto']['campaignTranslateDtoList'].length; i++) {
          if (res['campaignDto']['campaignTranslateDtoList'][i]['language']['code'] == 'ru') {
            this.rusValue = res['campaignDto']['campaignTranslateDtoList'][i]['name'];
          } else if (res['campaignDto']['campaignTranslateDtoList'][i]['language']['code'] == 'arm') {
            this.armValue = res['campaignDto']['campaignTranslateDtoList'][i]['name'];
          }
        }
      }

      for (let i = 0; i < this.newCampaignEventTypeArray.length; i++) {
        if (this.newCampaignEventTypeArray[i].name.toUpperCase() == res['campaignDto']['campaign']['campaignEvent']) {
          this.newCampaignEventTypeArray[i].checked = true;
        } else {
          this.newCampaignEventTypeArray[i].checked = false;
        }
      }
      this.selectedCampaignType = res['campaignDto']['campaign']['campaignType'];
      this.campaignTempVelue = res['campaignDto']['campaign']['campaignType'];
     // console.log('getCampaignById ashxadav',this.selectedCampaignType)
      this.campaignDto.campaign.campaignType = res['campaignDto']['campaign']['campaignType'];
      this.statusCampaign = res['campaignDto']['campaign']['isDisable'];
      this.startDate = new Date(res['campaignDto']['campaign']['start date']);
      this.endDate = new Date(res['campaignDto']['campaign']['end date']);
      let startTime = res['campaignDto']['campaign']['start date'].substring(10, 16);
      let endTime = res['campaignDto']['campaign']['end date'].substring(10, 16);
      this.firstTimeValue = startTime;
      this.secondTimeValue = endTime;
      this.statusCampaign = res['campaignDto']['campaign'].isDisable;
      // 2019-03-27  15:55:00:002019-03-29  22:22:00:00
      // 2019-03-26 14:22:002019-03-27 12:22:00
      validDate = res['campaignDto']['campaign']['start date'] + res['campaignDto']['campaign']['end date'] + 'aaaaaaaa';
      this.campaignService.validatorArray[0].date = validDate;
      // console.log(this.campaignService.validatorArray)
      this.compareToObject();
    });
  }

  openDialogConfirm() {
    this.modalDivConfirmStatus ? this.modalDivConfirmStatus = false : this.modalDivConfirmStatus = true;

  }

  closeRemoveConfirmModal(status) {

    if (status === 'yes') {
      this.selectedCampaignType = this.campaignVelue;
      this.campaignDto.campaign.campaignType = this.selectedCampaignType;
      this.campaignService.changeCampaignTypeStatus =true
      if (this.campaignDto.campaign.campaignType !== '') {
        this.campaignTypeValidator = false;
      }
      this.modalDivConfirmStatus = false;

      //console.log(this.selectedCampaignType);
     // console.log(this.idCampaign);
    } else {
     // console.log(this.selectedCampaignType);
     // console.log(this.campaignVelue);
      //console.log(this.campaignTempVelue);
      // this.selectedCampaignType = this.campaignTempVelue
      this.selectedCampaignType = this.campaignTempVelue;
      // this.campaignDto.campaign.campaignType = this.selectedCampaignType;
     // console.log(this.selectedCampaignType);
     // console.log(this.selectedCampaignType);
      this.modalDivConfirmStatus = false;
      this.campaignService.changeCampaignTypeStatus = false;
    }

  }


  ngDoCheck(): void {
    this.campaignService.validatorArray[0].engName = this.campaignDto.campaign.name;
    this.campaignService.validatorArray[0].description = this.campaignDto.campaign.description;
    this.campaignService.validatorArray[0].campaignType = this.campaignDto.campaign.campaignType;
    this.parseDateJsonFormatStart()
    // console.log(this.campaignService.validatorArray)
    if (this.campaignService.validatorArray[0].engName == '' ||
      this.campaignService.validatorArray[0].description == '' ||
      this.campaignService.validatorArray[0].campaignType == '' ||
      this.campaignService.validatorArray[0].date.length !== 46
    ) {
      this.valids = false;
    }

    if (this.campaignService.validatorArray[0].date.length == 46) {
      this.calendarValidator = false;
    }

  }
}
