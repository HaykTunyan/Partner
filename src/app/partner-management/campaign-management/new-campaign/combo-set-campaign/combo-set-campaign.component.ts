import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatAutocompleteSelectedEvent} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
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
  selector: 'app-combo-set-campaign',
  templateUrl: './combo-set-campaign.component.html',
  styleUrls: ['./combo-set-campaign.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ComboSetCampaignComponent implements OnInit, DoCheck {
  @Input('comboSet') valueGetCampaignById;

  @ViewChild('comboSetSelectComboItem') public comboSetSelectComboItem: ElementRef<HTMLInputElement>;
  @ViewChild('bonusWithPercent') public bonusWithPercent:ElementRef<HTMLSelectElement>
  @ViewChild('bonusWithUnit') public bonusWithUnit:ElementRef<HTMLSelectElement>
  partnerValue;
  imageUrl: string = null;
  file;
  partnerImageUrl: string;
  data = {
    image: ''
  };
  imageInput = ''
  fileInput
  comboSetType = [
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
  comboSetValidator = false;
  comboSetPartnerValidator = false;
  addNewButtonDisabled = true;
  timePeriodIndex = 0; // checked time period index.
  comboSetPartnerList: any = [];
  attachMenuItem = [];
  discountRate;
  comboName;
  deliveryFee;
  changeDiscountRateStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  setTimeOutFunctionCall;
  comboSetFormControl = new FormControl();
  attachMenu = [];
  selectedValuePartner = this.comboSetPartnerList[0];


  firstTimeValue: any = ''; // start time value.
  secondTimeValue: any = ''; // end time value.


  //calendar variabals
  date1 = new FormControl(moment()); // form for start time material input.
  date2 = new FormControl(moment()); // form for end time material input.
  startDate: any; // start date value.
  endDate: any; // end date value.
  firstTime = false; // start time input underline stile.
  secondTime = false; // end time input underline stile.

  tempComboSetObject = {};
  comboSet: any = {
    'bonusWithPresent': '',
    'bonusWithUnit': '',
    'campaignPartnerType': 'BRAND',
    'commissionRate': '',
    'deliveryFee': '',
    'description': '',
    'discountRate': '',
    'endDate': '',
    'image': '',
    'menuItemSet': [],
    'name': '',
    'partner': {
      'id': ''
    },
    'startDate': '',
    'validOrders': ''
  };

  constructor(private filesService: FilesService, private campaignManagementService: CampaignManagementService) {
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

      this.comboSetPartnerList = response;

    });
  }

  getInputValue(value?, type?) {


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      if (this.comboSet.bonusWithUnit.length == 0){
        this.bonusWithUnit.nativeElement.disabled = false
      }


      if (this.comboSet.bonusWithPresent.length == 0){
        this.bonusWithPercent.nativeElement.disabled = false
      }

      this.setValueInService();
    }, 1500);
  }

  /**
   * function for select type comboSet brand or branch
   * @param index
   * @param type
   */
  comboSetRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'comboSetType') {
      this.comboSet.campaignPartnerType = type[index].value;
      this.setValueInService();
    }


    this.timePeriodIndex = index;
  }


  remove(name: string): void {

    for (let i = 0; i < this.attachMenu.length; i++) {

      if (this.attachMenu[i]['name'] == name) {
        this.attachMenu.splice(i, 1);
        this.comboSet.menuItemSet = [];
        for (let i = 0; i < this.attachMenu.length; i++) {
          this.comboSet.menuItemSet.push(
            {
              id: this.attachMenu[i].id
            }
          );

        }

      }
    }
    if (this.comboSet.menuItemSet.length == 0){
      this.comboSetValidator = true
    }

    this.setValueInService();


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.attachMenu.push(event.option.value);
    this.comboSet.menuItemSet = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.comboSet.menuItemSet.push(
        {
          'id': this.attachMenu[i].id

        }
      );

    }
    this.comboSetValidator = false
    this.setValueInService();
    this.comboSetSelectComboItem.nativeElement.blur();
  }


  /**
   * function for select partner
   * @param event
   */
  changeValuePartner(event) {
    this.selectedValuePartner = event;
    this.attachMenuItem = event.menuItemDto;
    this.comboSet.partner.id = event.id;
    this.attachMenu = [];
    this.comboSetPartnerValidator =false
    this.setValueInService();
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
        this.comboSet.startDate = this[status];
        this.setValueInService();
      } else {
        this.comboSet.endDate = this[status];
        this.setValueInService();
      }

    }, 1500);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  //Image Upload
  onFileSelected(event) {
    // console.log(this.imageInput)
    this.file = event.target.files[0];
    this.imageUrl = this.file.name;
    const uploadData = new FormData();
    uploadData.append('file', this.file, this.imageUrl);
    this.filesService.saveFile(uploadData, 'IMAGE').subscribe(res => {
      if (res) {
        this.partnerImageUrl = res;
        this.imageInput = ''
        this.data.image = this.partnerImageUrl;
        this.comboSet.image = this.partnerImageUrl;
        this.setValueInService();
      }
    });
  }

  deleteAttachImg() {
    this.partnerImageUrl = null;
    this.imageUrl = null;
    this.comboSet.image = '';
    this.imageInput = ''
    this.setValueInService();
  }


  setValueInService() {
    if (this.comboSet.menuItemSet.length > 0){
      this.campaignManagementService.comboSetValidator.comboSet = this.comboSet.menuItemSet.length.toString();
    }
    this.campaignManagementService.comboSetValidator.partnerValue = this.comboSet.partner.id;

    this.campaignManagementService.comboSetCampaign.comboSet = this.comboSet;
  }

  compareToObject() {

    let id = this.tempComboSetObject['partner'].id;
    if (_.isEqual(this.comboSet, this.tempComboSetObject)) {

    } else {
      this.comboSet = JSON.parse(JSON.stringify(this.tempComboSetObject));
      this.comboSet.partner = {id: id};
      this.partnerImageUrl = this.tempComboSetObject['image'];
      this.imageUrl = this.tempComboSetObject['image'];

      this.comboSet.menuItemSet = [];
      for (let i = 0; i < this.tempComboSetObject['menuItemSet'].length; i++) {
        this.comboSet.menuItemSet.push({id: this.tempComboSetObject['menuItemSet'][i].id});
      }

      if (this.tempComboSetObject['startDate'] != null) {
        let startTime = this.tempComboSetObject['startDate'].substring(0, 5);
        this.firstTimeValue = startTime;
      }
      if (this.tempComboSetObject['endDate'] != null) {
        let endTime = this.tempComboSetObject['endDate'].substring(0, 5);
        this.secondTimeValue = endTime;
      }
      this.setValueInService();
    }

  }

  setValueInUpdate() {
   // console.log(this.valueGetCampaignById)
    this.tempComboSetObject = this.valueGetCampaignById['comboSet'];


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      for (let i = 0; i < this.comboSetPartnerList.length; i++) {
        if (this.comboSetPartnerList[i].id == this.valueGetCampaignById.comboSet.partner.id) {
          this.partnerValue = this.comboSetPartnerList[i];
          this.attachMenu = this.valueGetCampaignById.comboSet.menuItemSet;
          this.attachMenuItem = this.comboSetPartnerList[i]['menuItemDto'];

        }
      }
      for (let i = 0; i < this.attachMenu.length; i++) {
        this.attachMenu[i]['menuName'] = this.attachMenu[i].menu.name;
      }

      this.compareToObject();
    }, 1500);
  }

  ngDoCheck(): void {
// console.log(this.campaignManagementService.comboSetValidator)

    if (this.comboSet.menuItemSet.length > 0){
      this.campaignManagementService.comboSetValidator.comboSet = this.comboSet.menuItemSet.length.toString();
    }
    this.campaignManagementService.comboSetValidator.partnerValue = this.comboSet.partner.id;

    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.comboSetValidator.partnerValue == '') {
        this.comboSetPartnerValidator = true;
      } else {
        this.comboSetPartnerValidator = false;
      }

      if (this.campaignManagementService.comboSetValidator.comboSet == '') {
        this.comboSetValidator = true;
      } else {
        this.comboSetValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }
  }
}
