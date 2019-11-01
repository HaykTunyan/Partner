import {Component, Input, OnInit} from '@angular/core';
import {CampaignManagementService} from '../../../../services/campaign-management/campaign-management.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  @Input('voucher') valueGetCampaignById;

  // voucherCount:any = [1];
  addBackground = [];
  tempIndex;
  updateStatus = false;
  timePeriodIndex = 0; // checked time period index.
  voucherStatus = [{changeDiscountRateStatusValue: true}];
  setTimeOutFunctionCall;
  voucherItems = {
    buyingBonus: '',
    isActive: true,
    voucherPrice: ''
  };

  voucherUpdateObject: any = {
    'voucherItemSet': []
  };
  voucher = {
    'voucherItemSet': [{
      buyingBonus: '',
      isActive: true,
      voucherPrice: ''
    }]
  };

  buyingBonus = '';
  voucherPrice = '';
  statusAddButton = true;

  constructor(private campaignManagementService: CampaignManagementService) {
  }

  ngOnInit() {
    if (this.valueGetCampaignById && !this.campaignManagementService.changeCampaignTypeStatus) {
      this.setValueInUpdate();
    }
    this.campaignManagementService.changeCampaignTypeStatus = false;
  }

  setValueInService() {
    let index = this.voucher.voucherItemSet.length - 1;
    // console.log(this.voucher.voucherItemSet[index].buyingBonus.length);
    if (this.voucher.voucherItemSet[index].buyingBonus.length > 0 || this.voucher.voucherItemSet[index].voucherPrice.length >0) {
      this.statusAddButton = false;
    }else{
      this.statusAddButton = true;
    }


    // console.log( this.voucher);
    this.campaignManagementService.voucher.voucher = this.voucher;
    // console.log(this.campaignManagementService.voucher.voucher)
  }

  voucherSliderChange(index) {
    this.voucherStatus[index].changeDiscountRateStatusValue ? this.voucherStatus[index].changeDiscountRateStatusValue = false : this.voucherStatus[index].changeDiscountRateStatusValue = true;

    this.voucher.voucherItemSet[index].isActive = this.voucherStatus[index].changeDiscountRateStatusValue;
    this.setValueInService();
  }


  addNewVoucher() {
    // this.voucherCount.push(1);
    // this.addBackground.push(this.voucherCount.length+1);
    this.voucherStatus.push({changeDiscountRateStatusValue: true});
    this.voucher.voucherItemSet.push({
      buyingBonus: '',
      isActive: true,
      voucherPrice: ''
    });
    this.statusAddButton = true;
    // console.log(this.voucher.voucherItemSet);
  }

  removeVoucher(index) {
    // console.log(index);

    // let arr = this.voucherCount.splice(index-1,1)
    this.voucher.voucherItemSet.splice(index, 1);
    // console.log(this.voucherCount)
    if (this.voucher.voucherItemSet.length === 0){
      this.statusAddButton = false
    }
    // console.log(arr)
    // console.log(this.voucher.voucherItemSet);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getInputValue(value, type, index) {

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {
      // this.voucherItems[type] = value

      if (this.voucher.voucherItemSet.length == 0) {
        this.voucher.voucherItemSet.push(this.voucherItems);
        this.voucher.voucherItemSet[index][type] = value;
        this.setValueInService();
      } else if (this.voucher.voucherItemSet.length == 1) {
        this.voucher.voucherItemSet[index][type] = value;
        this.setValueInService();
      } else {
        this.voucher.voucherItemSet[index][type] = value;
        this.setValueInService();
      }

      // console.log(this.voucher.voucherItemSet);
    }, 0);
  }

  setValueInUpdate() {
    // console.log(this.valueGetCampaignById)
    this.voucherUpdateObject.voucherItemSet = JSON.parse(JSON.stringify(this.valueGetCampaignById.voucher.voucherItemSet));
    this.voucher.voucherItemSet = this.voucherUpdateObject.voucherItemSet;
    this.voucher['id'] = this.valueGetCampaignById.voucher.id;
    this.voucher.voucherItemSet = this.valueGetCampaignById.voucher.voucherItemSet;
    this.updateStatus = false;
    this.statusAddButton = false
    for (let i = 0; i < this.valueGetCampaignById.voucher.voucherItemSet.length; i++) {
      // this.voucherCount.push(1);
      this.voucherStatus.push({changeDiscountRateStatusValue: true});

      this.voucherStatus[i].changeDiscountRateStatusValue = this.valueGetCampaignById.voucher.voucherItemSet[i].isActive;

    }

    clearTimeout(this.setTimeOutFunctionCall);
    this.setTimeOutFunctionCall = setTimeout(() => {

      // this.compareToObject();
    }, 1000);
  }

}
