import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {CampaignManagementService} from '../../../../services/campaign-management/campaign-management.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent implements OnInit {
  @Input('promoCode') valueGetCampaignById;
  @ViewChild('promoMenuItem') promoMenuItem :ElementRef<HTMLInputElement>
  @ViewChild('bonusWithPercent') public bonusWithPercent:ElementRef<HTMLSelectElement>
  @ViewChild('bonusWithUnit') public bonusWithUnit:ElementRef<HTMLSelectElement>
  promoCodeValue;
  setTimeOutFunctionCall;
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
  partnerValue;
  selectedCampaignType;
  fromInventoryValue;
  fromMenuValue;
  timePeriodIndex = 0; // checked time period index.

  promoCodePartnerList: any = [];
  freeItemList: any = [];


  attachMenuItem = [];
  discountRate;
  deliveryFee;
  changeDiscountRateStatusValue = false;
  freeItemForPromoCodeStatusValue = true;
  bonusForPromoCodeStatusValue = false;
  discountForPromoCodeStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  attachMenu = [];
  promoCodeNameValidator = false

  promoCodeUpdate = {};
  promoCode = {
    'createPromoCode': '',
    'bonus': false,
    'bonusWithPercent': '',
    'bonusWithUnit': '',
    'campaignPartnerType': 'BRAND',
    'freeItem': true,
    'freeItemType': 'INVENTORY',
    'fromInventory': {
      'id': ''
    },
    'fromMenu': {
      'id': ''
    },
    'menuItemSet': [],
    'partner': {
      'id': ''
    }
  };


  constructor(private campaignManagementService: CampaignManagementService) {
  }

  ngOnInit() {
    this.getAllPartnersList();
    this.getAllFreeItemList();
    if (this.valueGetCampaignById && !this.campaignManagementService.changeCampaignTypeStatus) {
      this.setValueInUpdate();
    }
    this.campaignManagementService.changeCampaignTypeStatus = false
  }

  getAllPartnersList() {
    this.campaignManagementService.getAllPartnersList().subscribe(res => {

      this.promoCodePartnerList = res;
    });
  }

  getAllFreeItemList() {
    this.campaignManagementService.getAllGiftsList().subscribe(res => {
      this.freeItemList = res;

    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  promoCodeRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'discountType') {
      this.promoCode.campaignPartnerType = type[index].value;
      this.setValueInService();
    } else if (types == 'freeItemType') {
      this.promoCode.freeItemType = type[index].value;

      /*if (type[index].value === 'INVENTORY') {
        this.promoCode.fromMenu = null
      }else {
        this.promoCode.fromInventory = null;
      }*/
    }


    this.timePeriodIndex = index;
    // this.setValueInService();
  }

  setValueInService() {
    this.campaignManagementService.promoCode.promoCode = this.promoCode;

    this.campaignManagementService.promoCodeValidator.promoCodeName = this.promoCode.createPromoCode
  }

  getInputValue(event?) {


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      if (this.promoCode.createPromoCode !== ''){
        this.promoCodeNameValidator = false
      } else {
        this.promoCodeNameValidator = true
      }

      if (this.promoCode.bonusWithPercent.length == 0){
        this.bonusWithUnit.nativeElement.disabled = false
      }

      if (this.promoCode.bonusWithUnit.length == 0){
        this.bonusWithPercent.nativeElement.disabled = false
      }
      this.setValueInService();

    }, 500);
  }

  remove(name: string): void {

    for (let i = 0; i < this.attachMenu.length; i++) {

      if (this.attachMenu[i]['name'] == name) {
        this.attachMenu.splice(i, 1);
        this.promoCode.menuItemSet = [];
        for (let i = 0; i < this.attachMenu.length; i++) {
          this.promoCode.menuItemSet.push(
            {
              id: this.attachMenu[i].id
            }
          );

        }

      }
    }
    this.setValueInService();


  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.attachMenu.push(event.option.value);
    this.promoCode.menuItemSet = [];
    for (let i = 0; i < this.attachMenu.length; i++) {
      this.promoCode.menuItemSet.push(
        {
          id: this.attachMenu[i].id
        }
      );

    }
    this.setValueInService();
  }

  changeDiscountRateStatus() {
    this.changeDiscountRateStatusValue ?
      this.changeDiscountRateStatusValue = false :
      this.changeDiscountRateStatusValue = true;

  }

  freeItemForPromoCode() {
    this.freeItemForPromoCodeStatusValue ? this.freeItemForPromoCodeStatusValue = false : this.freeItemForPromoCodeStatusValue = true;
    this.freeItemForPromoCodeStatusValue ? this.bonusForPromoCodeStatusValue = false : this.bonusForPromoCodeStatusValue = true;
    this.promoCode.bonus = this.bonusForPromoCodeStatusValue;
    this.promoCode.freeItem = this.freeItemForPromoCodeStatusValue;
    this.promoCode.bonusWithPercent = '';
    this.promoCode.bonusWithUnit = '';

    if (this.promoCode.bonus == true){
      this.promoCode.campaignPartnerType ="BRAND"
      this.promoCode.freeItem = false;
      this.promoCode.freeItemType = 'INVENTORY';
      this.promoCode.fromInventory = null
      this.promoCode.fromMenu = null
      this.promoCode.menuItemSet = []
      this.promoCode.partner = null
    }else {
      this.promoCode.bonus = this.bonusForPromoCodeStatusValue;
      this.promoCode.freeItem = this.freeItemForPromoCodeStatusValue;
      this.promoCode.bonusWithPercent = '';
      this.promoCode.bonusWithUnit = '';
      this.promoCode.campaignPartnerType = 'BRAND';
      this.promoCode.freeItemType = 'INVENTORY';
      this.promoCode.fromInventory.id = '';
      this.promoCode.menuItemSet = [];
      this.promoCode.partner.id = '';
      this.promoCode.fromMenu ={id:''};
    }
    this.setValueInService();
  }

  bonusForPromoCodeStatus() {


    this.bonusForPromoCodeStatusValue ? this.bonusForPromoCodeStatusValue = false : this.bonusForPromoCodeStatusValue = true;
    this.bonusForPromoCodeStatusValue ? this.freeItemForPromoCodeStatusValue = false : this.freeItemForPromoCodeStatusValue = true;
    this.promoCode.bonus = this.bonusForPromoCodeStatusValue;
    this.promoCode.freeItem = this.freeItemForPromoCodeStatusValue;

    this.promoCode.campaignPartnerType = 'BRAND';
    this.promoCode.freeItemType = 'INVENTORY';
    this.promoCode.fromInventory.id = '';
    this.promoCode.menuItemSet = [];
    this.promoCode.partner.id = '';
    this.promoCode.fromMenu.id = '';

    if (this.promoCode.bonus == true){
      this.promoCode.campaignPartnerType ="BRAND"
      this.promoCode.freeItem = false;
      this.promoCode.freeItemType = 'INVENTORY';
      this.promoCode.fromInventory = null
      this.promoCode.fromMenu = null
      this.promoCode.menuItemSet = []
      this.promoCode.partner = null
    }else {
      this.promoCode.campaignPartnerType = 'BRAND';
      this.promoCode.freeItemType = 'INVENTORY';
      this.promoCode.fromInventory.id = '';
      this.promoCode.menuItemSet = [];
      this.promoCode.partner.id = '';
      this.promoCode.fromMenu ={id:''};
    }

    this.setValueInService();
  }

  changeValuePartner(event) {
    this.attachMenuItem = event.menuItemDto;
    this.promoCode.partner.id = event.id;
    this.attachMenu = [];
    this.setValueInService();
  }


  changeValueCampaignType(value, type) {

    if (type == 'inventory') {
      this.promoCode.fromInventory ={
        'id': ''
      }
      this.promoCode.fromInventory.id = value.id;
      this.promoCode.fromMenu = {
        'id': ''
      }
    } else if (type == 'fromMenu') {
      this.promoCode.fromMenu ={
        'id': ''
      }
      this.promoCode.fromMenu.id = value.id;
      this.promoCode.fromInventory ={
        'id': ''
      }
    }

    this.setValueInService();
  }

  compareToObject() {
    let id
    if (this.promoCodeUpdate['freeItem']) {
     id = this.promoCodeUpdate['partner'].id;
    }


    if (_.isEqual(this.promoCode, this.promoCodeUpdate)) {
    } else {
      this.promoCode = JSON.parse(JSON.stringify(this.promoCodeUpdate));
      this.promoCode.campaignPartnerType = this.promoCodeUpdate['campaignPartnerType'];

      this.promoCode.partner = {id: id};
      this.promoCode.createPromoCode = this.promoCodeUpdate['createPromoCode'];

      if (this.promoCodeUpdate['bonus'] == false) {
        this.promoCode.bonus = false;
      } else {
        this.promoCode.bonus = true;
      }

      if (this.promoCodeUpdate['freeItem'] == false) {
        this.promoCode.freeItem = false;
      } else {
        this.promoCode.freeItem = true;
      }

      if (this.promoCodeUpdate['freeItemType'] == 'INVENTORY') {
        this.promoCode.freeItemType = this.promoCodeUpdate['freeItemType'];
      } else {
        this.promoCode.freeItemType = this.promoCodeUpdate['freeItemType'];
      }

      if (this.promoCodeUpdate['bonusWithPercent'] !== null) {
        this.promoCode.bonusWithPercent = this.promoCodeUpdate['bonusWithPercent'];
      } else {
        this.promoCode.bonusWithPercent = '';
      }


      if (this.promoCodeUpdate[' bonusWithUnit'] !== null) {
        this.promoCode.bonusWithUnit = this.promoCodeUpdate['bonusWithUnit'];
      } else {
        this.promoCode.bonusWithUnit = '';
      }

      this.promoCode.menuItemSet = [];
      for (let i = 0; i < this.promoCodeUpdate['menuItemSet'].length; i++) {
        this.promoCode.menuItemSet.push({id: this.promoCodeUpdate['menuItemSet'][i].id});
      }


      if (this.promoCodeUpdate['fromInventory'] !==null) {
        this.promoCode.fromInventory = {id: this.promoCodeUpdate['fromInventory'].id};
      }else {
        this.promoCode.fromInventory = {id: ''};
      }

      this.setValueInService();
    }

  }

  setValueInUpdate() {
   // console.log(this.valueGetCampaignById)
    this.promoCodeUpdate = this.valueGetCampaignById.promoCode;

    this.promoCode.createPromoCode = this.promoCodeUpdate['createPromoCode'];
    this.promoCode.bonusWithPercent = this.promoCodeUpdate['bonusWithPercent'];
    this.promoCode.bonusWithUnit = this.promoCodeUpdate['bonusWithUnit'];
    this.bonusForPromoCodeStatusValue = this.promoCodeUpdate['bonus']
    this.freeItemForPromoCodeStatusValue = this.promoCodeUpdate['freeItem']
    for (let i = 0; i < this.discountType.length; i++) {
      if (this.discountType[i].value === this.promoCodeUpdate['campaignPartnerType'] && i === 0) {
        this.discountType[0].checked = true;
        this.discountType[1].checked = false;
      } else if (this.discountType[i].value === this.promoCodeUpdate['campaignPartnerType'] && i === 1) {
        this.discountType[1].checked = true;
        this.discountType[0].checked = false;
      }
    }


    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {


      if (this.promoCodeUpdate['freeItem']) {
        for (let i = 0; i < this.promoCodePartnerList.length; i++) {
          if (this.promoCodePartnerList[i].id == this.promoCodeUpdate['partner'].id) {
            this.partnerValue = this.promoCodePartnerList[i];
            this.attachMenu = this.promoCodeUpdate['menuItemSet'];
            this.attachMenuItem = this.promoCodePartnerList[i]['menuItemDto'];
          }
        }
      }

      for (let i = 0; i < this.attachMenu.length; i++) {
         this.attachMenu[i]['menuName'] = this.attachMenu[i].menu.name;
      }

      if (this.promoCodeUpdate['freeItemType'] == 'MENU') {
        this.freeItemType[0].checked = false;
        this.freeItemType[1].checked = true;
        for (let i = 0; i < this.attachMenu.length; i++) {
          if (this.attachMenu[i].id === this.promoCodeUpdate['fromMenu'].id) {
            this.fromMenuValue = this.attachMenu[i];
          }
        }
      }
      if (this.promoCodeUpdate['freeItem']) {
        if (this.promoCodeUpdate['freeItemType'] == 'INVENTORY') {
          this.freeItemType[0].checked = true;
          this.freeItemType[1].checked = false;
          for (let i = 0; i < this.freeItemList.length; i++) {
            if (this.freeItemList[i].id === this.promoCodeUpdate['fromInventory'].id) {
              this.fromInventoryValue = this.freeItemList[i];
            }
          }

        }
      }


      /*  for (let i = 0; i < this.partnerValue.menuItemDto.length; i++) {
          for (let j = 0; j < this.valueGetCampaignById.freeItemMenuItemGetDtos.length; j++) {
            this.commissionPercentage = this.valueGetCampaignById.freeItemMenuItemGetDtos[j].percentage;
            if (this.partnerValue.menuItemDto[i].id === this.valueGetCampaignById.freeItemMenuItemGetDtos[j].menuItemId) {
              this.attachMenu[j].menuName = this.partnerValue.menuItemDto[i].menuName;

            }
          }
        }*/
      this.compareToObject();
    }, 1000);
  }


  ngDoCheck(): void {

    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.promoCodeValidator.promoCodeName == '') {
        this.promoCodeNameValidator = true;
      } else {
        this.promoCodeNameValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }
  }
}
