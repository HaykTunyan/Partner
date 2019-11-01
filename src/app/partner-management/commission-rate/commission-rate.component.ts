// Commission Rate Component

import { Component, OnInit } from '@angular/core';
import {PartnersService} from '../../services/partners/partners.service';
import {PartnerCommisionRatService} from '../../services/partner-commission-rat/partner-commision-rat.service';
import {MenuItemCategoryService} from '../../services/menu-item-category/menu-item-category.service';
import {PartnerCommissionRateThresholdService} from '../../services/partner-commission-rate-threshold/partner-commission-rate-threshold.service';

// Component
@Component({
  selector: 'commission-rate',
  templateUrl: './commission-rate.component.html',
  styleUrls: ['./commission-rate.component.scss']
})

// export Commission Rate Component
export class CommissionRateComponent implements OnInit {

// drawer

showlist = true;

// tab two 

showMM = false;
showMP = false;
showPM = false;
showtabMM = false;
showtabMP = false;
showtabPM = false;
showTwotab = false;
partnerId;
commissionRate;
  saved
  category;
  public loading = false;
menuItemCategoryData;
commissionRateDataMM = {
  deliveryType: '',
  fixedComRatePerOrder: 0,
  menuItemCategoryState: false,
  partner: {
    id: null
  },
  partnerCommissionRate: 0,


};
  commissionRateDataPM = {
    deliveryType: '',
    fixedComRatePerOrder: 0,
    menuItemCategoryState: false,
    partner: {
      id: null
    },
    partnerCommissionRate: 0
  };
  commissionRateDataMP = {
    deliveryType: '',
    fixedComRatePerOrder: 0,
    menuItemCategoryState: false,
    partner: {
      id: null
    },
    partnerCommissionRate: 0
  };


  commissionRateDataThresholdMM = {
    defaultCommissionRate: 0,
    deliveryType: 'MM',
    menuItemCategoryState: false,
    money: 100,
    partner: {
      id: null
    },
  };
  commissionRateDataThresholdPM = {
    defaultCommissionRate: 0,
    deliveryType: 'PM',
    menuItemCategoryState: false,
    money: 200,
    partner: {
      id: null
    },
    threshold_type: ''
  };
  commissionRateDataThresholdMP = {
    defaultCommissionRate: 0,
    deliveryType: 'MP',
    menuItemCategoryState: false,
    money: 300,
    partner: {
      id: null
    },
    threshold_type: ''
  };

// Citrus Free
citrusFree = 'option2';

// Diary Free
diaryFree = "option1";

// Gluten Free
glutenFree = "option1";

// Choose menu item
choose = "option3" 

constructor(private  partnersService: PartnersService,
            private partnerCommissionRatService: PartnerCommisionRatService,
            private  menuItemCategoryService:  MenuItemCategoryService,
            private partnerCommissionRateThresholdService: PartnerCommissionRateThresholdService) { }

ngOnInit() {
    this.getPartnerItemCategory();

  console.log(this.menuItemCategoryData);
  this.partnersService.currentId.subscribe(id => this.partnerId = id);
  this.commissionRateDataMM.partner.id = this.partnerId;
  this.commissionRateDataPM.partner.id = this.partnerId;
  this.commissionRateDataMP.partner.id = this.partnerId;
  this.commissionRateDataThresholdMM.partner.id = this.partnerId;
  this.commissionRateDataThresholdPM.partner.id = this.partnerId;
  this.commissionRateDataThresholdMP.partner.id = this.partnerId;
  this.partnerCommissionRatService.getCommisionRate(this.partnerId, 'MM').subscribe(res => {
    if (res) {
      this.commissionRateDataMM = res;
    }
  });
  this.partnerCommissionRatService.getCommisionRate(this.partnerId, 'PM').subscribe(res => {
    if (res) {
      this.commissionRateDataPM = res;
    }
  });
  this.partnerCommissionRatService.getCommisionRate(this.partnerId, 'MP').subscribe(res => {
    if (res) {
      this.commissionRateDataMP = res;
    }
  });
}

  saveCommissionRateMM() {
    this.loading = true;
    this.partnerCommissionRatService.saveCommissionRate(this.commissionRateDataMM).subscribe(res => {
        this.loading = false;
      this.saved = true;
        setTimeout(() => {
          this.saved = false;
        }, 1000)

       console.log(res);
    }, err => {
      this.loading = false;
    });
  }
  saveCommissionRatePM() {
    this.partnerCommissionRatService.saveCommissionRate(this.commissionRateDataPM).subscribe(res => {
      this.loading = false;
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
      }, 1000)
      console.log(res);
    }, err => {
      this.loading = false;
    });
  }
  saveCommissionRateMP() {
    this.partnerCommissionRatService.saveCommissionRate(this.commissionRateDataMP).subscribe(res => {
      this.loading = false;
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
      }, 1000)
      console.log(res);
    }, err => {
      this.loading = false;
    });
  }
  getPartnerItemCategory() {
    this.menuItemCategoryService.getMenuItemCategory().subscribe(res => {
      console.log(res)
      this.menuItemCategoryData = res;
      console.log(this.menuItemCategoryData);
    });
  }
  cancelDataMM() {
   this.commissionRateDataMM.partnerCommissionRate = 0;
   this.commissionRateDataMM.fixedComRatePerOrder = 0;
  }
  cancelDataPM() {
    this.commissionRateDataPM.partnerCommissionRate = 0;
    this.commissionRateDataPM.fixedComRatePerOrder = 0;
  }
  cancelDataMP() {
    this.commissionRateDataMP.partnerCommissionRate = 0;
    this.commissionRateDataMP.fixedComRatePerOrder = 0;
  }
  cancelDataTresholdMM() {
    this.commissionRateDataThresholdMM.defaultCommissionRate = 0;
    this.commissionRateDataThresholdMM.money = 0;
  }
  cancelDataTresholdPM() {
    this.commissionRateDataThresholdPM.defaultCommissionRate = 0;
    this.commissionRateDataThresholdPM.money = 0;
  }
  cancelDataTresholdMP() {
    this.commissionRateDataThresholdMP.defaultCommissionRate = 0;
    this.commissionRateDataThresholdMP.money = 0;
  }
  saveCommissionRateTrasholdMM() {
    this.partnerCommissionRateThresholdService.saveCommissionRateThreshold(this.commissionRateDataThresholdMM).subscribe(res => {
      console.log(res);
    });
  }

}
