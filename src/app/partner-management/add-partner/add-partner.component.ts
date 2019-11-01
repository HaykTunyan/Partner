// Add Partner Component.

import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PartnersService } from '../../services/partners/partners.service';
import { LanguageService } from '../../services/language/language.service';
import { PartnerServicesService } from '../../services/partner-services/partner-services.service';
import { BrandService } from '../../services/brand/brand.service';
import { LegalEntityService } from '../../services/legal-entity/legal-entity.service';
import { PartnerContactsService } from '../../services/partner-contacts/partner-contacts.service';
import { AccountService } from '../../services/account/account.service';
import { Router } from '@angular/router';
import { FilesService } from '../../services/files/files.service';
import { ImageService } from '../../services/image/image.service';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// Keyword
export interface Keyword {
  name: string;
}

@Component({
  selector: 'add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})

// Export Add Partner Component
export class AddPartnerComponent implements OnInit {

constructor (private partnersService: PartnersService,
             private languageService: LanguageService,
             private partnerServicesService: PartnerServicesService,
             private brandService: BrandService,
             private legalEntityService: LegalEntityService,
             private partnerContactsService: PartnerContactsService,
             private router: Router,
             private accountService: AccountService,
             private filesService:  FilesService,
             private imageService: ImageService) {}

// Card One
automatedDisable;
value = 'Clear me';
activeData = false;
checkedRestaurant = false;
checkedShop = false;
checkedPrinter = false;
checkedMobileApp = false;
checkedPhone = false;
serviceTypes;
imageUrl: string = null;
file;
partnerImageUrl: string;
brandSelected;
perferableSelected;
serviceCategories: any;
brands;
partnerCategory;
selectedPartnerCategory = [];
minOrderAmount: number;
legalEntities: any;
selectedPartnerServiceCategory;
selectedServiceType;
contactTypes = [];
contactTypeSelected;
contactTypeSelectedOne;
contactTypeSelectedTwo;
contactTypeSelectedThree;
contactTypeSelectedFour;
contactValue: Keyword [] = [];
contactValueOne: Keyword [] = [];
contactValueTwo: Keyword [] = [];
contactValueThree: Keyword [] = [];
contactValueFour: Keyword [] = [];
typesSelected;
typesSelectedOne;
typesSelectedTwo;
typesSelectedThree;
typesSelectedFour;
checkedMM = false;
checkedPM = false;
checkedMP = false;
billingCycle: number;
gracePeriod: number;
maxCreditLimit: number;
everyHour: number;
delayTime: number;
billingCycleType:any;
orderPayment;
partnerPaymentMethod;
gracePeriodType:any;
legalEntity;
billingCycleStartDate: string;
partnerId;
errorStatus = null;
errorText = '';
errorModal;
imageId;
// automatedDisable = true;

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
  accountData = {
    name: '',
    email: '',
  };

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

  data = {
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
  billingCycle: 0,
  billingCycleStartDate: '',
  billingCycleType: '',
  brand: {id: null},
  callCenterInstruction: null,
  contactPersonName: null,
  contractNumber: null,
  deliveryType: '',
  driverInstructions: null,
  gracePeriod: 0,
  gracePeriodType: '',
  images: [],
  keywords: [],
  legalEntity: {id: null},
  maxCreditLimit: 0,
  minOrderAmount: null,
  mobileAcceptanceMethod: '',
  name: '',
  orderPayment: '',
  partnerType: '',
  partnerServiceTypes: [],
  partnerServiceCategories: [],
  partnerCategory: [],
  partnerPaymentMethod: '',
  partnerContact: [],
  point: {
        latitude: null,
        longitude: null
      },
  status: '',
    user : {
    email: '',
    name: '',
    type: 'EXTERNAL'
  }
};

contactType = [
  {
    name: 'Phone Number'
  },
  {
    name: 'Email'
  }
];

myControl = new FormControl();
filteredOptions: Observable<string[]>;

// Card Two

Phonenumber = "Phone number";

Contacttype = "Contact type";

Orderreleted = "Order releted";

Forwhat = "For what";

brandoption = '';

// Table header
showlist = true;

// panel toggle
panelOpenState = false;

// brand
brand = 'option2';

// Keywords.
visible = true;
selectable = true;
removable = true;
addOnBlur = true;
selectedAll: any;
selectedOne: any;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
roles: any = [];
role = '';
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
getRoles() {
  this.partnersService.getRoles().subscribe(data => {
    this.roles = data;
    console.log(this.roles);
  })
}
addContact(event: MatChipInputEvent, status: string): void {
  const input = event.input;
  const value = event.value;
  if ((value || '').trim()) {
    this[status].push({name: value.trim()});
  }
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

remuveContact(keyword: Keyword, status: string): void {
  const index = this[status].indexOf(keyword);
  if (index >= 0) {
    this[status].splice(index, 1);
  }
}
// ngOnInit

ngOnInit() {
  this.getLanguages();
  this.getAllBrand();
  this.getAllServiceCategories();
  this.getAllServiceTypes();
  this.getAllPartnerCategory();
  this.getAllLegalEntity();
  this.getPartnerContactsType();
  this.getRoles(); 

}

//Add Partner
addPartner() {
    this.data.status = this.activeData ? 'ACTIVE' : 'INACTIVE';
    this.checkedRestaurant || this.checkedShop ? this.data.partnerType =  this.checkedShop ? 'SHOP' : 'RESTAURANT' : this.data.partnerType = null;
    this.checkedPrinter || this.checkedPhone || this.checkedMobileApp
     ? this.data.mobileAcceptanceMethod = this.checkedPrinter ? 'PRINTER' : this.checkedPhone
      ? 'PHONE' : 'MOBILE_APP' : this.data.mobileAcceptanceMethod = null;
    this.brandSelected ? this.data.brand.id = this.brandSelected : this.data.brand = null;
    this.perferableSelected ? this.data.brand.id = this.perferableSelected : this.data.brand = null;
    this.legalEntity ? this.data.legalEntity.id = this.legalEntity : this.data.legalEntity = null;
    this.selectedPartnerCategory && this.selectedPartnerCategory.forEach(item => this.data.partnerCategory.push({id: item}));
    this.minOrderAmount ? this.data.minOrderAmount = this.minOrderAmount : this.data.minOrderAmount = null;
    this.selectedPartnerServiceCategory && this.selectedPartnerServiceCategory.forEach(item => this.data.partnerServiceCategories.push({id: item}));
    this.selectedServiceType && this.selectedServiceType.forEach(item => this.data.partnerServiceTypes.push({id: item}));
    this.data.keywords = this.keywords;
    this.everyHour ? this.data.billingCycle = this.everyHour : this.data.billingCycle = null;
    this.delayTime ? this.data.billingCycle = this.delayTime : this.data.billingCycle = null; 
    this.billingCycle ? this.data.billingCycle = this.billingCycle : this.data.billingCycle = null;
    this.gracePeriod ? this.data.gracePeriod = this.gracePeriod :this.data.gracePeriod = null;
    this.maxCreditLimit ? this.data.maxCreditLimit = this.maxCreditLimit : this.data.maxCreditLimit = null;
    this.billingCycleType ? this.data.billingCycleType = this.billingCycleType : this.data.billingCycleType = null;
    this.orderPayment ? this.data.orderPayment = this.orderPayment : this.data.orderPayment = null;
    this.gracePeriodType ? this.data.gracePeriodType = this.gracePeriodType : this.data.gracePeriodType = null;
    this.partnerPaymentMethod ? this.data.partnerPaymentMethod = this.partnerPaymentMethod : this.data.partnerPaymentMethod = null;
    if (this.data.point.latitude === null && this.data.point.longitude ===null) {
      this.data.point = null;
    }
    this.checkedMM || this.checkedPM || this.checkedMP ? this.data.deliveryType = this.checkedMM ? 'MM' : this.checkedPM ? 'PM' : 'MP' : this.data.deliveryType = null;
    if (this.contactTypeSelected) {
      this.contactTypeSelected === 'Phone Number' ? this.data.partnerContact.push({phoneNumber: this.contactValue,
        type: this.typesSelected}) : this.data.partnerContact.push({email: this.contactValue,
        type: this.typesSelected});
    } else {
      this.data.partnerContact = null;
    }
    if (this.contactTypeSelectedOne) {
      this.contactTypeSelectedOne === 'Phone Number' ? this.data.partnerContact.push({phoneNumber: this.contactValueOne,
        type: this.typesSelectedOne}) : this.data.partnerContact.push({email: this.contactValueOne,
        type: this.typesSelectedOne});
    }
    if (this.contactTypeSelectedTwo) {
      this.contactTypeSelectedTwo === 'Phone Number' ? this.data.partnerContact.push({phoneNumber: this.contactValueTwo,
        type: this.typesSelectedTwo}) : this.data.partnerContact.push({email: this.contactValueTwo,
        type: this.typesSelectedTwo});
    }
    if (this.contactTypeSelectedThree) {
      this.contactTypeSelectedThree === 'Phone Number' ? this.data.partnerContact.push({phoneNumber: this.contactValueThree,
        type: this.typesSelectedThree}) : this.data.partnerContact.push({email: this.contactValueThree,
        type: this.typesSelectedThree});
    }
    if (this.contactTypeSelectedFour) {
      this.contactTypeSelectedFour === 'Phone Number' ? this.data.partnerContact.push({phoneNumber: this.contactValueFour,
        type: this.typesSelectedFour}) : this.data.partnerContact.push({email: this.contactValueFour,
        type: this.typesSelectedFour});
    }
  this.accountData.name ? this.data.user.name = this.accountData.name : this.data.user = null;
  this.accountData.email ? this.data.user.email = this.accountData.email : this.data.user = null;
    this.billingCycleStartDate ? this.data.billingCycleStartDate =
      `${new Date(this.billingCycleStartDate).getFullYear()}-${('0' + new Date(this.billingCycleStartDate).getMonth() + 1).slice(-2)}-${('0' + new Date(this.billingCycleStartDate).getDate()).slice(-2)}` : this.data.billingCycleStartDate = null;
    this.partnersService.addPartner(this.data).subscribe(response => {
      if (response.status == 201 || response.status == 200) {
      this.router.navigateByUrl('/partner-list')
      const partnerName = this.data.name
      this.getPartnerByName(partnerName);
      setTimeout(() => {
        if (this.translationDataArm.name) {
          this.saveTranslate(this.partnerId, this.translationDataArm.languageCode, this.translationDataArm.name);
        }
        if (this.translationDataRus.name) {
          this.saveTranslate(this.partnerId, this.translationDataRus.languageCode, this.translationDataRus.name);
        }
        // this.addAccount();
    });

      } else {
        this.router.navigateByUrl('/add-partner');
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

//Get partner Service Category
getAllServiceCategories() {
  this.partnerServicesService.getAllServiceCategories().subscribe(response => {
    if (response) {
      this.serviceCategories = response.content;
    }
  });
}

//Get Languages
getLanguages() {
  this.languageService.getLanguages().subscribe(response => console.log(response));
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

//Get All Legal Entity
getAllLegalEntity() {
  this.legalEntityService.getAllLegalEntity().subscribe(response => {
    if (response) {
      this.legalEntities = response;
    }
  });
}

getPartnerContactsType() {
  this.partnerContactsService.getPartnerContactsType().subscribe(response => {
    if (response) {
      Object.keys(response).forEach(item => this.contactTypes.push({name: response[item], key: item}));
    }
  });
}

// Get Partner By Name
getPartnerByName(name) {
  this.partnersService.getPartnerByName(name).subscribe(res => {
    if (res) {
      this.partnerId = res.id;
    }
  });
}

//Save Translate
saveTranslate(id, code, name) {
  this.partnersService.saveTranslate(id, code, name).subscribe(response => {
    if (response) {
      console.log(response)
    }
  });
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
            const imageData = response;
            this.imageId = imageData.id;
            this.data.images.push({id: this.imageId, img: imageData.img, logo: false});
          }
        });
      }
    });
}

topPage() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

// Address Changes
changeCityName(event) {
  this.data.address.city.name = event.target.value;
}

changeStreetName(event) {
  this.data.address.street.name = event.target.value;
}

changeBuildingNumber(event) {
  this.data.address.buildingNumber = event.target.value;
}

// Key Event
numberValidation(event) {
  if (isNaN(event.key) || event.charCode === 32) {
    return false;
  }
}
// delete Image
  deleteImage() {
    this.imageUrl = '';
  this.imageService.deleteImage(this.imageId).subscribe(res => {
    if (res) {

      }
    });
  }

 
emailFormControl = new FormControl('', [
  Validators.required,
  Validators.email,
]);

matcher = new MyErrorStateMatcher();

}
