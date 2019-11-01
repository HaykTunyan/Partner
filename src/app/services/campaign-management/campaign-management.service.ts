import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export const DOMAIN = environment.domain;

@Injectable({
  providedIn: 'root'
})
export class CampaignManagementService {

  changeCampaignTypeStatus = false;
  saveButtonClick = 0;
  validatorArray = [
    {
      engName: '',
      description: '',
      date: '',
      campaignType: ''
    }
  ];

  discountOrDeliveryValidatorArray = [
    {
      deliveryFee: '',
      discountRate: '',
      everyItemSetValue: '',
      partnerValue: '',
      menuItem: ''
    }
  ];

  comboSetValidator = {
    partnerValue: '',
    comboSet: ''
  };

  bonusValidator = {
    partnerValue: '',
    menuItem: ''
  };

  freeItemValidator = {
    partnerValue: '',
    menuItem: '',
    freeItemName: '',
    freeItemImage: '',
    freeItem: ''
  };

  sponsoredValidator = {
    partnerValue: '',
    menuItem: '',
    serviceType: ''
  };
  outOfScheduleValidator = {
    partnerValue: '',
    menuItem: ''
  };

  promoCodeValidator = {
    promoCodeName: ''
  };

  customersListValidator = {
    regDateBoolean: '',
    regDate: '',


    birthDayBoolean: '',
    birthDate: '',


    corporateBoolean: '',
    corporateClient: '',


    labelBoolean: '',
    label: ''
  };


  newCampaign = {};
  customersListSelection = {};

  comboSetCampaign = {
    campaignDto: this.newCampaign,
    comboSet: {}
  };
  bonus = {
    campaignDto: this.newCampaign,
    campaignBonus: {},
    campaignBonusPercentageMenuItem: {}
  };
  sponsoredPartner = {
    campaignDto: this.newCampaign,
    sponsoredPartnerItems: {}
  };
  promoCode = {
    campaignDto: this.newCampaign,
    promoCode: {}

  };
  outOfSchedule = {
    campaignDto: this.newCampaign,
    outOfSchedule: {}
  };
  voucher = {
    campaignDto: this.newCampaign,
    voucher: {}
  };
  discountOrDelivery = {};
  freeItem = {
    campaignDto: this.newCampaign,
    freeItem: {},
    menuItemPercentageDtoSet: {}
  };

  constructor(private  http: HttpClient) {
    this.getTokenFromLocalStorage();
  }

  getDataFromNewCampaign(data: any) {
    this.getTokenFromLocalStorage();

  }

  token: string;
  header;
  baseUrl = `${DOMAIN}`;

  getTokenFromLocalStorage() {
    if (localStorage.getItem('menu-user')) {
      this.token = JSON.parse(localStorage.getItem('menu-user')).token;
    } else {
      this.token = ' ';
    }
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer.${this.token}`
    });
  }


  /**
   * get all partner list
   */
  getAllPartnersList() {
    return this.http.get(`${this.baseUrl}campaign/get_all_partners`, {headers: this.header});
  }

  // campaign/get_all_campaigns_by_limit
  get_all_campaigns_by_limit(page, count) {
    return this.http.get(`${this.baseUrl}campaign/get_all_campaigns_by_limit?page=${page}&size=${count}`, {headers: this.header});
  }

  downloadList() {
    return this.http.get(`${this.baseUrl}download_campaign`);
  }

  /**
   * function for filter campaign list
   */
  getCampaignListByFilter(page, filterDate, sorting) {
    let queryParam = `?page=${page}&size=20`;
    filterDate.campaignName ? queryParam += `&name=${filterDate.campaignName}` : '';
    filterDate.campaignType ? queryParam += `&campaignType=${filterDate.campaignType}` : '';
    filterDate.description ? queryParam += `&description=${filterDate.description}` : '';
    filterDate.startDate ? queryParam += `&startDate=${filterDate.startDate}` : '';
    filterDate.endDate ? queryParam += `&endDate=${filterDate.endDate}` : '';
    filterDate.id ? queryParam += `&id=${filterDate.id}` : '';
    if (sorting) {
      queryParam += `&sort=${sorting.name},${sorting.status}`;
    }
    return this.http.get(`${this.baseUrl}campaign/campaign_filter${queryParam}`, {headers: this.header});
  }

  /**
   * function for get all gifts list
   * @param page
   * @param count
   */
  get_all_gifts_by_limit(page, count) {
    return this.http.get(`${this.baseUrl}campaign/get_all_gifts_by_limit?page=${page}&size=${count}`, {headers: this.header});
  }


  /**
   * function for filter campaign list
   */
  getCampaignGiftsListByFilter(page, filterDate, sorting) {
    let queryParam = `?page=${page}&size=20`;
    filterDate.giftName ? queryParam += `&name=${filterDate.giftName}` : '';
    filterDate.giftCondition ? queryParam += `&itemCondition=${filterDate.giftCondition}` : '';
    filterDate.giftUsed ? queryParam += `&used=${filterDate.giftUsed}` : '';
    filterDate.giftDate ? queryParam += `&creationDate=${filterDate.giftDate}` : '';
    filterDate.quantity ? queryParam += `&quantity=${filterDate.quantity}` : '';
    filterDate.id ? queryParam += `&id=${filterDate.id}` : '';
    if (sorting) {
      queryParam += `&sort=${sorting.name},${sorting.status}`;
    }
    console.log(queryParam);
    return this.http.get(`${this.baseUrl}campaign/gift_filter${queryParam}`, {headers: this.header});
  }


  /**
   * get all corporate clients
   * campaign/all_corporate_clients
   */
  getAllCorporateClients() {
    return this.http.get(`${this.baseUrl}campaign/get_all_corporate_clients`, {headers: this.header});
  }

  /**
   * get all labels
   * campaign/get_all_labels
   */
  getAllLabels() {
    return this.http.get(`${this.baseUrl}campaign/get_all_labels`, {headers: this.header});
  }

  /**
   * get all gifts list
   */
  getAllGiftsList() {
    return this.http.get(`${this.baseUrl}campaign/get_all_gifts`, {headers: this.header});
  }

  getCampaignById(id) {
    return this.http.get(`${this.baseUrl}campaign/get_campaign_by_id?id=${id}`, {headers: this.header});
  }

  removeCampaignById(id){
    return this.http.post(`${this.baseUrl}campaign/delete_campaign?id=${id}`, id,{headers: this.header});
  }


  addSponsoredPartnerItemsCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.sponsoredPartner;
      body['campaignDto'] = this.newCampaign;
    }

    return this.http.post(`${this.baseUrl}campaign/save_sponsored_items`, body, {headers: this.header});

  }

  updateSponsoredPartnerItemsCampaign(id) {
    let body = this.sponsoredPartner;
    body['campaignDto'] = this.newCampaign;
    body['campaignDto']['campaign']['id'] = id;
    return this.http.post(`${this.baseUrl}campaign/update_campaign_sponsored`, body, {headers: this.header});
  }

  addOutOfScheduleItemsCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.outOfSchedule;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['outOfSchedule'][key] = this.customersListSelection[key];
      }
    }

    return this.http.post(`${this.baseUrl}campaign/save_campaign_out_of_schedule`, body, {headers: this.header});
  }

  updateOutOfScheduleItemsCampaign(id) {
    let body = this.outOfSchedule;

    body.campaignDto = this.newCampaign;
    body['campaignDto']['campaign']['id'] = id;
    for (let key in this.customersListSelection) {
      body['outOfSchedule'][key] = this.customersListSelection[key];
    }
    return this.http.post(`${this.baseUrl}campaign/update_campaign_out_of_schedule`, body, {headers: this.header});
  }

  addVoucherCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.voucher;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['voucher'][key] = this.customersListSelection[key];
      }
    }
    for (let i = 0; i <body.voucher.voucherItemSet.length ; i++) {
      if (body.voucher.voucherItemSet[i].voucherPrice == '' && body.voucher.voucherItemSet[i].buyingBonus == ''){
        console.log('mdav if')
        body.voucher.voucherItemSet.splice(i,1)
      }

    }

   return this.http.post(`${this.baseUrl}campaign/save_campaign_voucher`, body, {headers: this.header});
  }

  updateVoucherCampaign(id) {
    let body = this.voucher;
    body['campaignDto'] = this.newCampaign;
    body['campaignDto']['id'] = id;
    for (let key in this.customersListSelection) {
      body['voucher'][key] = this.customersListSelection[key];
    }

    return this.http.post(`${this.baseUrl}campaign/update_campaign_voucher`, body, {headers: this.header});
  }

  addDiscountOrDeliveryCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.discountOrDelivery;
      body['campaignDto'] = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['discount'][key] = this.customersListSelection[key];
      }
    }

    return this.http.post(`${this.baseUrl}campaign/save_campaign_discount`, body, {headers: this.header});
  }

  updateDiscountOrDeliveryCampaign(id) {
    let body = this.discountOrDelivery;
    body['campaignDto'] = this.newCampaign;
    body['campaignDto']['campaign'].id = id;
    for (let key in this.customersListSelection) {
      body['discount'][key] = this.customersListSelection[key];
    }
    return this.http.post(`${this.baseUrl}campaign/update_campaign_discount`, body, {headers: this.header});
  }

  addComboSetCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.comboSetCampaign;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['comboSet'][key] = this.customersListSelection[key];
      }
    }

    return this.http.post(`${this.baseUrl}campaign/save_campaign_combo`, body, {headers: this.header});
  }

  updateComboSetCampaign(id) {
    let body = this.comboSetCampaign;
    body['campaignDto'] = this.newCampaign;
    body['campaignDto']['campaign']['id'] = id;
    for (let key in this.customersListSelection) {
      body['comboSet'][key] = this.customersListSelection[key];
    }
    return this.http.post(`${this.baseUrl}campaign/update_campaign_combo`, body, {headers: this.header});
  }

  addBonusCampaign(bodyValue?) {
    let body;
    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.bonus;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['campaignBonus'][key] = this.customersListSelection[key];
      }
    }


    this.bonusValidator = {
      partnerValue: '',
      menuItem: ''
    }
   this.bonus = {
      campaignDto: this.newCampaign,
      campaignBonus: {},
      campaignBonusPercentageMenuItem: {}
    };
    return this.http.post(`${this.baseUrl}campaign/save_campaign_bonus`, body, {headers: this.header});
  }

  updateBonusCampaign(id) {

    let body = this.bonus;
    body.campaignDto = this.newCampaign;
    for (let key in this.customersListSelection) {
      body['campaignBonus'][key] = this.customersListSelection[key];
    }
    body['campaignDto']['campaign']['id'] = id;
    delete body.campaignBonus['campaign'];
    return this.http.post(`${this.baseUrl}campaign/update_campaign_bonus`, body, {headers: this.header});
  }


  addFreeItemCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.freeItem;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['freeItem'][key] = this.customersListSelection[key];
      }
    }

    return this.http.post(`${this.baseUrl}campaign/save_campaign_free_item`, body, {headers: this.header});
  }

  updateFreeItemCampaign(id) {
    let body = this.freeItem;
    body.campaignDto = this.newCampaign;
    body['campaignDto']['campaign']['id'] = id;
    for (let key in this.customersListSelection) {
      body['freeItem'][key] = this.customersListSelection[key];
    }
    return this.http.post(`${this.baseUrl}campaign/update_campaign_free_item`, body, {headers: this.header});
  }


  addPromoCodeCampaign(bodyValue?) {
    let body;

    if (bodyValue) {
      body = bodyValue;
    } else {
      body = this.promoCode;
      body.campaignDto = this.newCampaign;
      for (let key in this.customersListSelection) {
        body['promoCode'][key] = this.customersListSelection[key];
      }
    }


    return this.http.post(`${this.baseUrl}campaign/save_campaign_promo_code`, body, {headers: this.header});
  }

  updatePromoCodeCampaign(id) {
    let body = this.promoCode;
    body.campaignDto = this.newCampaign;
    body['campaignDto']['campaign']['id'] = id;
    for (let key in this.customersListSelection) {
      body['promoCode'][key] = this.customersListSelection[key];
    }
    return this.http.post(`${this.baseUrl}campaign/update_campaign_promo_code`, body, {headers: this.header});
  }

}
