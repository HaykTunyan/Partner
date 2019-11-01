// Edit Partner Component.

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { PartnersService } from '../../services/partners/partners.service';
import { LanguageService } from '../../services/language/language.service';
import { PartnerServicesService } from '../../services/partner-services/partner-services.service';
import { BrandService } from '../../services/brand/brand.service';
import { LegalEntityService } from '../../services/legal-entity/legal-entity.service';
import { PartnerContactsService } from '../../services/partner-contacts/partner-contacts.service';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';
import { FilesService } from '../../services/files/files.service';
import {ImageService} from '../../services/image/image.service';


// Keyword
export interface Keyword {
  name: string;
}

@Component({
  selector: 'edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

// Export Edit Partner Component
export class EditPartnerComponent implements OnInit {

constructor (private partnersService: PartnersService,
             private languageService: LanguageService,
             private partnerServicesService: PartnerServicesService,
             private brandService: BrandService,
             private legalEntityService: LegalEntityService,
             private partnerContactsService: PartnerContactsService,
             private router: Router,
             private accountService: AccountService,
             private  filesService:  FilesService,
             private imageService: ImageService) {}

  Forwhat = " For what ";
  partnerId;
  brandName;
  legalEntity;
  translationData;
  activeData = false;
  checkedRestaurant = false;
  checkedShop = false;
  checkedPrinter = false;
  checkedMobileApp = false;
  checkedPhone = false;
  checkedMM = false;
  checkedPM = false;
  checkedMP = false;
  brandSelected = '';
  selectedPartnerCategory = [];
  imageUrl: string = null;
  file;
  partnerImageUrl: string;
  contactTypeSelected;
  contactTypeSelectedOne;
  contactTypeSelectedTwo;
  contactTypeSelectedThree;
  contactTypeSelectedFour;
  contactValue;
  contactValueOne;
  contactValueTwo;
  contactValueThree;
  contactValueFour;
  typesSelected;
  typesSelectedOne;
  typesSelectedTwo;
  typesSelectedThree;
  typesSelectedFour;
  contactTypes = [];
  countryName = 'Armenia';
  addressZip;
  cityName;
  streetName;
  buildingNumber;
  selectedPartnerServiceCategory = [];
  selectedServiceType = [];
  edit;
  partnerCategoryChange: boolean;
  serviceCategoryChange: boolean;
  serviceTypesChange: boolean;
  legalEntityChange: boolean;
  billingCycleStartDate: string;
  billingCycle;
  billingCycleType;
  maxCreditLimit;
  orderPayment;
  gracePeriod;
  gracePeriodType;
  partnerPaymentMethod;
  accountData = {
    name: '',
    email: ''
  };
  errorStatus = null;
  errorText = '';
  emailDisabled = true;
  userId: number;
  userActive: boolean;
  imageId: number;

partner = {
  id: null,
  name: '',
  status: '',
  partnerType: '',
  mobileAcceptanceMethod: '',
  partnerServiceTypes: [],
  partnerServiceCategories: [],
  brand: {id: null},
  images: [],
  partnerCategory: [],
  minOrderAmount: null,
  driverInstructions: null,
  callCenterInstruction: null,
  contractNumber: null,
  deliveryType: '',
  billingCycle: 0,
  billingCycleStartDate: '',
  billingCycleType: '',
  maxCreditLimit: 0,
  gracePeriod: 0,
  orderPayment: '',
  partnerPaymentMethod: '',
  gracePeriodType: '',
  legalEntity: {id: null},
  keywords: [],
  createDate: '',
  partnerContact: [],
  address: {
    zip: '',
    buildingNumber: '',
    city: {
      name: ''
    },
    country: {
      name: 'Armenia'
    },
    street: {
      name: ''
    }
  },
  contactPersonName: null,
  user : {
    id: null,
    email: '',
    name: '',
    type: 'EXTERNAL',
    active: false
  },
  point: {
    latitude: null,
    longitude: null
  }
};

serviceCategories;
serviceTypes;
brands;
partnerCategory;
legalEntities;

// keyword
keywords: Keyword[] = [];
  dateType = [
    {
      name: 'day',
      key: 'DAY'
    },
    {
      name: 'month',
      key: 'MONTH'
    },
    {
      name: 'week',
      key: 'WEEK'
    }
  ];
  orderPaymentType = [
    {
      name: 'postpaid',
      key: 'POSTPAID'
    },
    {
      name: 'cash',
      key: 'CASH'
    }
  ];
  partnerPaymentType = [
    {
      name: 'postpaid',
      key: 'POSTPAID'
    },
    {
      name: 'prepaid',
      key: 'PREPAID'
    }
  ];

//Translation Data for ru
translationDataRus = {
  name: '',
  languageCode: 'ru',
};

//Translation Data for Arm
translationDataArm = {
  name: '',
  languageCode: 'am',
};

//Contact Type
contactType = [
  {
    name: 'Phone Number'
  },
  {
    name: 'Email'
  }
];

// map angular
// title: string = 'GPS Coordinates (link to online map)';
// lat: number = 51.678418;
// lng: number = 7.809007;

// Card Four

value = 'Clear me';

// Table header
showlist = true;

// panel toggle
panelOpenState = false;
selected;


// Keywords.
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
selectedAll: any;
selectedOne: any;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];

ngOnInit() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  this.getPartnerContactsType();
  this.getAllBrand();
  this.getAllServiceCategories();
  this.getAllPartnerCategory();
  this.getAllServiceTypes();
  this.getAllLegalEntity();
  this.partnersService.currentId.subscribe(id => this.partnerId = id);
  console.log(this.partnerId)
  if (this.partnerId) {
    this.getPartnerById();
    this.partner.id = this.partnerId;
  }
  setTimeout(() => {
    delete this.partner.createDate;
    this.partner.partnerType === 'RESTAURANT' ?
    this.checkedRestaurant = true : this.checkedRestaurant = false;
    this.partner.partnerType === 'SHOP' ? this.checkedShop = true : this.checkedShop = false;
    this.partner.deliveryType === 'MM' ? this.checkedMM = true : this.partner.deliveryType === 'PM' ? this.checkedPM = true : this.checkedMP = true;
    this.partner.mobileAcceptanceMethod === 'PRINTER' ? this.checkedPrinter = true : this.checkedPrinter = false;
    this.partner.mobileAcceptanceMethod === 'PHONE' ? this.checkedPhone = true : this.checkedPhone = false;
    this.partner.mobileAcceptanceMethod === 'MOBILE_APP' ? this.checkedMobileApp = true : this.checkedMobileApp = false;
   this.partner.images[0] ? this.partnerImageUrl = this.partner.images[0].img : this.partnerImageUrl = null;
    this.partner.user && this.partner.user.name ? this.accountData.name = this.partner.user.name : this.accountData.name = '';
    this.partner.user && this.partner.user.email ? this.accountData.email = this.partner.user.email : this.accountData.email = '';

    if (this.partner.brand != null && this.partner.brand.id) {
      this.brandSelected = '';
      this.brandSelected = this.partner.brand.id.toString();
    }
    if (this.partner.legalEntity && this.partner.legalEntity.id) {
      this.legalEntity = '';
        this.legalEntity = this.partner.legalEntity.id.toString();
    }
    if (this.partner.keywords) {
      this.keywords = this.partner.keywords;
    }

    if (this.partner.partnerCategory) {
      this.selectedPartnerCategory = [];
      this.partner.partnerCategory.forEach(item => {
        this.selectedPartnerCategory.push(item.id.toString());
      });
     }
    if (this.partner.partnerServiceCategories) {
      this.selectedPartnerServiceCategory = [];
      this.partner.partnerServiceCategories.forEach(item => {
        this.selectedPartnerServiceCategory.push(item.id.toString());
      });
    }
    if (this.partner.partnerServiceTypes) {
      this.selectedServiceType = [];
      this.partner.partnerServiceTypes.forEach(item => {
        this.selectedServiceType.push(item.id.toString());
      });
    }

    if (this.partner.address) {
      this.addressZip = this.partner.address.zip;
      this.buildingNumber = this.partner.address.buildingNumber;
      this.partner.address.city ? this.cityName = this.partner.address.city.name : this.cityName = '';
      this.partner.address.street ? this.streetName = this.partner.address.street.name : this.streetName = '';
      this.partner.address = {
        zip: this.cityName,
        buildingNumber: this.buildingNumber,
        city: {
          name: this.cityName
        },
        country: {
          name: 'Armenia'
        },
        street: {
          name: this.streetName

        }
      };
    }

    if (this.partner.partnerContact[0]) {
      this.partner.partnerContact[0].phoneNumber ?
        this.contactTypeSelected = 'Phone Number' :
        this.contactTypeSelected = 'Email';

      const  contactType = this.contactTypes.filter(item =>
        item.key === this.partner.partnerContact[0].type);
      if (contactType[0]) {
        this.typesSelected = contactType[0].key;
      }

      this.contactValue = this.partner.partnerContact[0].phoneNumber ?
        this.partner.partnerContact[0].phoneNumber : this.partner.partnerContact[0].email;
    }

    if (this.partner.partnerContact[1]) {
      this.partner.partnerContact[1].phoneNumber ?
        this.contactTypeSelectedOne = 'Phone Number' :
        this.contactTypeSelectedOne = 'Email';
      const  contactType = this.contactTypes.filter(item =>
        item.key === this.partner.partnerContact[1].type);
      if (contactType[0]) {
        this.typesSelectedOne = contactType[0].key;
      }
      this.contactValueOne = this.partner.partnerContact[1].phoneNumber ?
        this.partner.partnerContact[1].phoneNumber : this.partner.partnerContact[1].email;
    }

    if (this.partner.partnerContact[2]) {
      this.partner.partnerContact[2].phoneNumber ?
        this.contactTypeSelectedTwo = 'Phone Number' :
        this.contactTypeSelectedTwo = 'Email';
      const  contactType = this.contactTypes.filter(item =>
        item.key === this.partner.partnerContact[2].type);
      if (contactType[0]) {
        this.typesSelectedTwo = contactType[0].key;
      }
      this.contactValueTwo = this.partner.partnerContact[2].phoneNumber ?
        this.partner.partnerContact[2].phoneNumber : this.partner.partnerContact[2].email;
    }

    if (this.partner.partnerContact[3]) {
      this.partner.partnerContact[3].phoneNumber ?
        this.contactTypeSelectedThree = 'Phone Number' :
        this.contactTypeSelectedThree = 'Email';
      const  contactType = this.contactTypes.filter(item =>
        item.key === this.partner.partnerContact[3].type);
      this.typesSelectedThree = contactType[0].key;
      this.contactValueThree = this.partner.partnerContact[3].phoneNumber ?
        this.partner.partnerContact[3].phoneNumber : this.partner.partnerContact[3].email;
    }

    if (this.partner.partnerContact[4]) {
      this.partner.partnerContact[4].phoneNumber ?
        this.contactTypeSelectedFour = 'Phone Number' :
        this.contactTypeSelectedFour = 'Email';
      const  contactType = this.contactTypes.filter(item =>
        item.key === this.partner.partnerContact[4].type);
      this.typesSelectedFour = contactType[0].key;
      this.contactValueFour = this.partner.partnerContact[4].phoneNumber ?
        this.partner.partnerContact[4].phoneNumber : this.partner.partnerContact[4].email;
    }
    this.partner.billingCycle ? this.billingCycle = this.partner.billingCycle : this.billingCycle = null;
    this.partner.billingCycleType ? this.billingCycleType = this.partner.billingCycleType : this.billingCycleType = null;
    this.partner.maxCreditLimit ? this.maxCreditLimit = this.partner.maxCreditLimit : this.maxCreditLimit = null;
    this.partner.orderPayment ? this.orderPayment = this.partner.orderPayment : this.orderPayment = null;
    this.partner.billingCycleStartDate ? this.billingCycleStartDate = this.partner.billingCycleStartDate : this.billingCycleStartDate = null;
    this.partner.gracePeriod ? this.gracePeriod = this.partner.gracePeriod : this.gracePeriod = null;
    this.partner.gracePeriodType ? this.gracePeriodType = this.partner.gracePeriodType : this.gracePeriodType = null;
    this.partner.partnerPaymentMethod ? this.partnerPaymentMethod = this.partner.partnerPaymentMethod : this.partnerPaymentMethod = null;
    if (this.partner.user && this.partner.user.id) {
      this.userId = this.partner.user.id;
      this.userActive = this.partner.user.active;
    }
  }, 1000);

this.getAllTranslations(this.partnerId);

}

// Keywords functionality
add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;

  // Add our keyword
  if ((value || '').trim()) {
    this.keywords.push({name: value.trim()});
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}

// remove keyword
remove(keyword: Keyword): void {
  const index = this.keywords.indexOf(keyword);

  if (index >= 0) {
    this.keywords.splice(index, 1);
  }
}


//Change checked  value
onChangeChecked(event) {
  if (event.value == 1) {
    this.checkedRestaurant = true;
    this.checkedShop = false;
  }

  if (event.value == 2) {
    this.checkedShop = true;
    this.checkedRestaurant = false;
  }

  if (event.value == 3) {
    this.checkedPrinter = true;
    this.checkedMobileApp = false;
    this.checkedPhone = false;
  }

  if (event.value == 4) {
    this.checkedPrinter = false;
    this.checkedMobileApp = true;
    this.checkedPhone = false;
  }

  if (event.value == 5) {
    this.checkedPrinter = false;
    this.checkedMobileApp = false;
    this.checkedPhone = true;
  }

  if (event.source.value == 6) {
    this.checkedMM = true;
    this.checkedPM = false;
    this.checkedMP = false;
  }

  if (event.source.value == 7) {
    this.checkedMM = false;
    this.checkedPM = true;
    this.checkedMP = false;
  }

  if (event.source.value == 8) {
    this.checkedMM = false;
    this.checkedPM = false;
    this.checkedMP = true;

  }
}


getPartnerById() {
  this.partnersService.getPartnerById(this.partnerId).subscribe(response => {
    if (response) {
      this.partner = response;
      // console.log(this.partner)
    }
  });
}

//Get partner Service Category
getAllServiceCategories() {
  this.partnerServicesService.getAllServiceCategories().subscribe(response => {
    if (response) {
      this.serviceCategories = response.content;
    }
  });
}

//Get all Servives types
getAllServiceTypes() {
  this.partnerServicesService.getAllServiceTypes().subscribe(
    response => {
      if (response) {
        this.serviceTypes = response.content;
      }
    });
}

//Get All Brand
getAllBrand() {
  this.brandService.getAllBrand().subscribe(response => {
    if (response) {
      const dataBrand = response;
      this.brands = dataBrand.content;
    }
  });
}

//Get All Partner Category
getAllPartnerCategory() {
  this.partnersService.getAllPartnerCategory().subscribe(response => {
    if (response) {
      this.partnerCategory = response;
    }
  });
}

//Contact Types
getPartnerContactsType() {
  this.partnerContactsService.getPartnerContactsType().subscribe(response => {
    if (response) {
      Object.keys(response).forEach(item => this.contactTypes.push({name: response[item], key: item}));
    }
  });
}

//Get All Legal Entity
getAllLegalEntity() {
  this.legalEntityService.getAllLegalEntity().subscribe(response => {
    if (response) {
      this.legalEntities = response;
    }
  });
}

//All translations
  getAllTranslations(id) {
  this.partnersService.getAllTranslations(id).subscribe(res => {
    if (res) {
      this.translationData = res;
      this.translationData.forEach(item => {
        if (item && item.language.code === 'am') {
          this.translationDataArm.name = item.name;
        }
        if (item && item.language.code === 'ru') {
          this.translationDataRus.name = item.name;
        }
      });
    }
  });
}

//Edit Partner
  editPartner() {
    this.checkedRestaurant || this.checkedShop ? this.partner.partnerType =  this.checkedShop ? 'SHOP' : 'RESTAURANT' : this.partner.partnerType = null;
    this.checkedPrinter || this.checkedPhone || this.checkedMobileApp
      ? this.partner.mobileAcceptanceMethod = this.checkedPrinter ? 'PRINTER' : this.checkedPhone
      ? 'PHONE' : 'MOBILE_APP' : this.partner.mobileAcceptanceMethod = null;
    this.partner.keywords = this.keywords;
    if (this.serviceCategoryChange) {
      this.partner.partnerServiceCategories = [];
      this.selectedPartnerServiceCategory && this.selectedPartnerServiceCategory.forEach(item => this.partner.partnerServiceCategories.push({id: +item}));
    }
    if (this.serviceTypesChange) {
      this.partner.partnerServiceTypes = [];
      this.selectedServiceType && this.selectedServiceType.forEach(item => this.partner.partnerServiceTypes.push({id: +item}));
    }

    this.partner.address = {
      zip: this.addressZip,
      buildingNumber: this.buildingNumber,
      city: {
        name: this.cityName
      },
      country: {
        name: 'Armenia'
      },
      street: {
        name: this.streetName
      }
    };
    //Contacts
    if (!this.partner.partnerContact[0]) {
      this.contactTypeSelected && this.contactTypeSelected === 'Phone Number' ? this.partner.partnerContact.push({phoneNumber: this.contactValue,
        type: this.typesSelected}) : this.partner.partnerContact.push({email: this.contactValue,
        type: this.typesSelected});
    } else {
      this.contactTypeSelected === 'Phone Number' ? this.partner.partnerContact[0].phoneNumber = this.contactValue : this.partner.partnerContact[0].email = this.contactValue;
      this.contactTypeSelected === 'Phone Number' ? this.partner.partnerContact[0].email = null : this.partner.partnerContact[0].phoneNumber = null;
      this.partner.partnerContact[0].type = this.typesSelected;
    }
    if (!this.partner.partnerContact[1]) {
      if (this.contactTypeSelectedOne) {
        this.contactTypeSelectedOne === 'Phone Number' ? this.partner.partnerContact.push({phoneNumber: this.contactValueOne,
          type: this.typesSelectedOne}) : this.partner.partnerContact.push({email: this.contactValueOne,
          type: this.typesSelectedOne});
      }
    } else {
      this.contactTypeSelectedOne === 'Phone Number' ? this.partner.partnerContact[1].phoneNumber = this.contactValueOne : this.partner.partnerContact[1].email = this.contactValueOne;
      this.contactTypeSelectedOne === 'Phone Number' ? this.partner.partnerContact[1].email = null : this.partner.partnerContact[1].phoneNumber = null;
      this.partner.partnerContact[1].type = this.typesSelectedOne;
    }
    if (!this.partner.partnerContact[2]) {
      if (this.contactTypeSelectedTwo) {
        this.contactTypeSelectedTwo === 'Phone Number' ? this.partner.partnerContact.push({phoneNumber: this.contactValueTwo,
          type: this.typesSelectedTwo}) : this.partner.partnerContact.push({email: this.contactValueTwo,
          type: this.typesSelectedTwo});
      }
    }
    else {
      this.contactTypeSelectedTwo === 'Phone Number' ? this.partner.partnerContact[2].phoneNumber = this.contactValueTwo : this.partner.partnerContact[2].email = this.contactValueTwo;
      this.contactTypeSelectedTwo === 'Phone Number' ? this.partner.partnerContact[2].email = null : this.partner.partnerContact[2].phoneNumber = null;
      this.partner.partnerContact[2].type = this.typesSelectedTwo;
    }
    if (!this.partner.partnerContact[3]) {
      if (this.contactTypeSelectedThree) {
        this.contactTypeSelectedThree === 'Phone Number' ? this.partner.partnerContact.push({phoneNumber: this.contactValueThree,
          type: this.typesSelectedThree}) : this.partner.partnerContact.push({email: this.contactValueThree,
          type: this.typesSelectedThree});
      }
    } else {
      this.contactTypeSelectedThree === 'Phone Number' ? this.partner.partnerContact[3].phoneNumber = this.contactValueThree : this.partner.partnerContact[3].email = this.contactValueThree;
      this.contactTypeSelectedThree === 'Phone Number' ? this.partner.partnerContact[3].email = null : this.partner.partnerContact[3].phoneNumber = null;
      this.partner.partnerContact[3].type = this.typesSelectedThree;
    }

    if (!this.partner.partnerContact[4]) {
      if (this.contactTypeSelectedFour) {
        this.contactTypeSelectedFour === 'Phone Number' ? this.partner.partnerContact.push({phoneNumber: this.contactValueFour,
          type: this.typesSelectedFour}) : this.partner.partnerContact.push({email: this.contactValueFour,
          type: this.typesSelectedFour});
      }
    } else {
      this.contactTypeSelectedFour === 'Phone Number' ? this.partner.partnerContact[4].phoneNumber = this.contactValueFour : this.partner.partnerContact[4].email = this.contactValueFour;
      this.contactTypeSelectedFour === 'Phone Number' ? this.partner.partnerContact[4].email = null : this.partner.partnerContact[4].phoneNumber = null;
      this.partner.partnerContact[4].type = this.typesSelectedFour;
    }

    // this.minOrderAmount ? this.partner.minOrderAmount = this.minOrderAmount : this.partner.minOrderAmount = null;
    this.brandSelected ? this.partner.brand = {id: +this.brandSelected} : this.partner.brand = null;
    this.legalEntity ? this.partner.legalEntity = {id: +this.legalEntity} : this.partner.legalEntity = null;
    if (this.partnerCategoryChange) {
      this.partner.partnerCategory = [];
      this.selectedPartnerCategory && this.selectedPartnerCategory.forEach(item => this.partner.partnerCategory.push({id: +item}));
    }

    if (!this.partner.callCenterInstruction) {
      this.partner.callCenterInstruction = null;
    }
    this.billingCycle ? this.partner.billingCycle = this.billingCycle : this.partner.billingCycle = null;
    this.billingCycleType ? this.partner.billingCycleType = this.billingCycleType : this.partner.billingCycleType = null;
    this.maxCreditLimit ? this.partner.maxCreditLimit = this.maxCreditLimit : this.partner.maxCreditLimit = null;
    this.orderPayment ? this.partner.orderPayment = this.orderPayment : this.partner.orderPayment = null;
    this.billingCycleStartDate ? this.partner.billingCycleStartDate =
      `${new Date(this.billingCycleStartDate).getFullYear()}-${('0' + new Date(this.billingCycleStartDate).getMonth() + 1).slice(-2)}-${('0'
        + new Date(this.billingCycleStartDate).getDate()).slice(-2)}` : this.partner.billingCycleStartDate = null;
    this.gracePeriod ? this.partner.gracePeriod = this.gracePeriod : this.partner.gracePeriod = null;
    this.gracePeriodType ? this.partner.gracePeriodType = this.gracePeriodType : this.partner.gracePeriodType = null;
    this.partnerPaymentMethod ? this.partner.partnerPaymentMethod = this.partnerPaymentMethod : this.partner.partnerPaymentMethod = null;
    this.checkedMM || this.checkedPM || this.checkedMP ? this.partner.deliveryType = this.checkedMM ? 'MM' : this.checkedPM ? 'PM' : 'MP' : this.partner.deliveryType = null;
    if (this.partner.point && this.partner.point.latitude === null && this.partner.point.longitude === null || !this.partner.point) {
      this.partner.point = null;
    }
    this.accountData.name ? this.partner.user.name = this.accountData.name : this.partner.user = null;
    this.accountData.email ? this.partner.user.email = this.accountData.email : this.partner.user = null;

    this.partnersService.addPartner(this.partner).subscribe(res => {
    if (res.status == 201 || res.status == 200) {
      this.router.navigateByUrl('/partner-list');
      if (this.translationDataArm.name) {
        this.saveTranslate(this.partnerId, this.translationDataArm.languageCode, this.translationDataArm.name);
      }
      if (this.translationDataRus.name) {
        this.saveTranslate(this.partnerId, this.translationDataRus.languageCode, this.translationDataRus.name);
      }
    }
  }, err => {
      this.errorStatus = err.status;
      if (this.errorStatus == 422) {
        this.errorText = 'The Partner Name field  is empty.';
      }
      if (this.errorStatus == 400) {
        this.errorText = 'The Partner already exists.';
      }
    });
}

  //Save Translate
  saveTranslate(id, code, name) {
    this.partnersService.saveTranslate(id, code, name).subscribe(response => {
      if (response) {
        // console.log(response)
      }
    });
  }

  changeBrandName(name) {
    this.brandName = name;
  }

  //Image Upload
  onFileSelected(event) {
    this.file = event.target.files[0];
    this.imageUrl = this.file.name;
    const uploadData = new FormData();
    uploadData.append('file', this.file, this.imageUrl);
    this.filesService.saveFile(uploadData, 'IMAGE').subscribe(res => {
      if (res) {
        this.partnerImageUrl = res;
        this.imageService.saveImages({img: this.partnerImageUrl}).subscribe(response => {
          if (response) {
            this.partner.images = [];
            const imageData = response;
            this.imageId = imageData.id;
            this.partner.images.push({id: this.imageId, img: imageData.img, logo: false});
          }
        });
      }
    });
  }
  topPage() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
  resendInvitationMail() {
    this.accountService.resendInvitationEmail(this.userId).subscribe(res => {
      // console.log(res)
    });
  }
  resetPasswordSendEmail() {
  // console.log('hhhhhhhhhhhhh')
    this.accountService.resetPasswordSendEmail(this.userId).subscribe(res => {
      // console.log(res)
    });
  }

  // Key Event
numberValidation(event) {
  if (isNaN(event.key) || event.charCode === 32) {
    return false;
  }
}

// delete Image
  deleteImage() {
    this.partnerImageUrl = '';
    this.partner.images = [];
    this.imageService.deleteImage(this.partner.images[0].id).subscribe(res => {
      if (res) {
      }
    });
  }


}
