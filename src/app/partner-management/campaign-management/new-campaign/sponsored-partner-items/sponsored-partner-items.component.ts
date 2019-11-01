import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {CampaignManagementService} from '../../../../services/campaign-management/campaign-management.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-sponsored-partner-items',
  templateUrl: './sponsored-partner-items.component.html',
  styleUrls: ['./sponsored-partner-items.component.scss']
})
export class SponsoredPartnerItemsComponent implements OnInit,DoCheck {
  @Input('sponsoredPartner') valueGetCampaignById;
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
  setTimeOutFunctionCall
  paymentWith = [
    {
      name: 'Number of Clicks',
      value:'NUMBER_OF_CLICKS',
      checked: true
    },
    {
      name: 'Number of Views',
      value:'NUMBER_OF_VIEWS',
      checked: false
    }
  ];
  menuItemValue
  partnerValue
  selectedCampaignType;
  serviceTypeValue
  timePeriodIndex = 0; // checked time period index.
  attachMenuItemSponsored: any = [];
  changeDiscountRateStatusValue = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  attachMenu = [];
  attachMenuItem = [];
  partnerServiceTypesList = [];


  sponsoredPartnersItemsUpdateObject :any = {}
  sponsoredPartnerItems = {
    campaignPartnerType: 'BRAND',

    menuItem: {
      'id':''
    },
    partner: {
      'id': ''
    },
    paymentType: 'NUMBER_OF_CLICKS',
    serviceType: {
      'id': ''
    }
  };
  sponsoredPartnerValidator = false
  serviceTypeValidator = false
  menuItemValidator = false

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
      this.attachMenuItemSponsored = res;

    });
  }


  sponsoredRadioClick(index, type, types) {
    for (let i = 0; i < type.length; i++) {
      type[i].checked = false;
    }
    type[index].checked = true;
    if (types == 'discountType') {
       this.sponsoredPartnerItems.campaignPartnerType = type[index].value;
      this.setValueInService();
    }else {
      this.sponsoredPartnerItems.paymentType = type[index].value
      this.setValueInService();
    }


    this.timePeriodIndex = index;
    // this.setValueInService();
  }


  remove(name: string): void {


    for (let i = 0; i < this.attachMenu.length; i++) {

      if (this.attachMenu[i]['value'] == name) {
        this.attachMenu.splice(i, 1);
      }
    }


  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.attachMenu.push(event.option.value);
  }


  changeValuePartner(event) {
    this.attachMenuItem = event.menuItemDto;
    this.partnerServiceTypesList = event.partnerServiceTypes;
    this.sponsoredPartnerItems.partner.id = event.id
    this.attachMenu = [];
    // this.fromInventoryValue = '';
    // this.fromMenuValue = ''
    this.sponsoredPartnerValidator = false
    this.setValueInService();
  }

  setValueItemAndServiceType(event,type,id){
    this.sponsoredPartnerItems[type][id] = event.id

    if (type == 'menuItem'){
      this.menuItemValidator = false
    } else if (type == 'serviceType') {
     this.serviceTypeValidator = false
    }

    this.setValueInService()
  }

  changeValueCampaignType(value) {
    this.selectedCampaignType = value;
  }

  setValueInService() {
    this.campaignManagementService.sponsoredPartner.sponsoredPartnerItems = this.sponsoredPartnerItems;


    this.campaignManagementService.sponsoredValidator.partnerValue = this.sponsoredPartnerItems.partner.id
    this.campaignManagementService.sponsoredValidator.serviceType = this.sponsoredPartnerItems.serviceType.id
    this.campaignManagementService.sponsoredValidator.menuItem = this.sponsoredPartnerItems.menuItem.id
  }

  compareToObject() {

    let id = this.sponsoredPartnersItemsUpdateObject.partner.id
    if (_.isEqual(this.sponsoredPartnerItems, this.sponsoredPartnersItemsUpdateObject)) {
    } else {
       this.sponsoredPartnerItems =JSON.parse(JSON.stringify(this.sponsoredPartnersItemsUpdateObject)) ;


       this.sponsoredPartnerItems.partner = {id: id};

     this.sponsoredPartnerItems.menuItem = {id : this.sponsoredPartnersItemsUpdateObject.menuItem.id}
     this.sponsoredPartnerItems.serviceType = {id:this.sponsoredPartnersItemsUpdateObject.serviceType.id}
     this.sponsoredPartnerItems.paymentType = this.sponsoredPartnersItemsUpdateObject.paymentType


      this.setValueInService();
    }

  }

  setValueInUpdate() {
   // console.log(this.valueGetCampaignById)
    this.sponsoredPartnersItemsUpdateObject = this.valueGetCampaignById.sponsoredPartnerItems;
    for (let i = 0; i < this.discountType.length; i++) {
      if (this.discountType[i].value === this.valueGetCampaignById.sponsoredPartnerItems.campaignPartnerType && i === 0) {
        this.discountType[0].checked = true;
        this.discountType[1].checked = false;
      } else if (this.discountType[i].value === this.valueGetCampaignById.sponsoredPartnerItems.campaignPartnerType && i === 1) {
        this.discountType[1].checked = true;
        this.discountType[0].checked = false;
      }
    }
    for (let i = 0; i < this.paymentWith.length; i++) {
      if (this.paymentWith[i].value === this.valueGetCampaignById.sponsoredPartnerItems.paymentType && i === 0) {
        this.paymentWith[0].checked = true;
        this.paymentWith[1].checked = false;
      } else if (this.paymentWith[i].value === this.valueGetCampaignById.sponsoredPartnerItems.paymentType && i === 1) {
        this.paymentWith[1].checked = true;
        this.paymentWith[0].checked = false;
      }
    }
    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      for (let i = 0; i < this.attachMenuItemSponsored.length; i++) {
        if (this.attachMenuItemSponsored[i].id == this.valueGetCampaignById.sponsoredPartnerItems.partner.id) {
          this.partnerValue = this.attachMenuItemSponsored[i];
          this.attachMenuItem = this.partnerValue.menuItemDto;
          this.partnerServiceTypesList = this.partnerValue.partnerServiceTypes
          this.attachMenuItem = this.attachMenuItemSponsored[i]['menuItemDto'];
        }
      }
      for (let i = 0; i <this.partnerServiceTypesList.length ; i++) {
        if (this.partnerServiceTypesList[i].id === this.valueGetCampaignById.sponsoredPartnerItems.serviceType.id) {
          this.serviceTypeValue = this.partnerServiceTypesList[i]
        }
      }

      for (let i = 0; i <this.attachMenuItem.length ; i++) {
        if (this.attachMenuItem[i].id=== this.valueGetCampaignById.sponsoredPartnerItems.menuItem.id)
          this.menuItemValue = this.attachMenuItem[i]
      }
      this.compareToObject();
    }, 1000);
  }



  ngDoCheck(): void {

    if (this.campaignManagementService.saveButtonClick !== 0) {
      if (this.campaignManagementService.sponsoredValidator.partnerValue == '') {
        this.sponsoredPartnerValidator = true;
      } else {
        this.sponsoredPartnerValidator = false;
      }

      if (this.campaignManagementService.sponsoredValidator.menuItem == '') {
        this.menuItemValidator = true;
      } else {
        this.menuItemValidator = false;
      }
      if (this.campaignManagementService.sponsoredValidator.serviceType == '') {
        this.serviceTypeValidator = true;
      } else {
        this.serviceTypeValidator = false;
      }
      this.campaignManagementService.saveButtonClick = 0;
    }
  }

}
