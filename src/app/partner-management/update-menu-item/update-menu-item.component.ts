import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {Keyword} from '../add-partner/add-partner.component';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-update-menu-item',
  templateUrl: './update-menu-item.component.html',
  styleUrls: ['../edit-menus/edit-menus.component.scss'],
})
export class UpdateMenuItemComponent implements OnInit {
  id: any;
  showMenuPage = true;
  showAddMenuModal = false;

  @Output() close = new EventEmitter();
  @Input() addItem: boolean;
  @Input() editMenuItem: object;

  item: any = {
    engName: '',
    rusName: '',
    armName: '',
    engDescription: '',
    rusDescription: '',
    armDescription: '',
    products: [{
      id: 1,
      name: 'product1'
    }, {
      id: 2,
      name: 'product2'
    }],
    sections: [{
      id: 1,
      name: 'section1'
    }, {
      id: 2,
      name: 'section2'
    }, {
      id: 3,
      name: 'section3'
    }, {
      id: 4,
      name: 'section4'
    }],
    liters: [{
      id: 1,
      name: 'Liter'
    }, {
      id: 2,
      name: 'g'
    }, {
      id: 3,
      name: 'pcs'
    }],
    categories: [{
      id: 1,
      name: 'category1'
    }, {
      id: 2,
      name: 'category2'
    }],
    commissionCategories: [{
      id: 1,
      name: 'commission category1'
    }, {
      id: 2,
      name: 'commission category2'
    }],

    productSelected: '',
    sectionSelected: [],
    deliveryConditions: [
      {
        value: 'Liquid',
        id: '1',
        checked: false
      },
      {
        value: 'Fragile',
        id: '2',
        checked: false
      },
      {
        value: 'Cold',
        id: '3',
        checked: false
      }
    ],
    selectedDeliveryConditions: [],
    literSelected: '',
    categorySelected: [],
    commissionCategorySelected: '',
    price: null,
    previouslyOrderedDays: '',
    preparationTime: '',
    measurement: '',
    deliveryAmount: '',
    keywords: [{
      name: 'keyword1'
    }, {
      name: 'keyword2'
    }, {
      name: 'keyword1'
    }, {
      name: 'keyword2'
    }],
    imgs: [],
    menuItemActive: true
  };

  @Inject(DOCUMENT) document: Document;

  checked = [false, false, false];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    console.log(this.addItem, '++++', this.editMenuItem);
    if (!this.addItem) {
      console.log('Update page');
      // ------------- this.item - in piti vergrenq this.editedItem ----------------
      this.item = {
        engName: 'aaaaaaaaa',
        rusName: '',
        armName: '',
        engDescription: 'bbbbbbbbbbbbbbbb',
        rusDescription: '',
        armDescription: '',
        products: [{
          id: 1,
          name: 'product1'
        }, {
          id: 2,
          name: 'product2'
        }],
        sections: [{
          id: 1,
          name: 'section1'
        }, {
          id: 2,
          name: 'section2'
        }, {
          id: 3,
          name: 'section3'
        }, {
          id: 4,
          name: 'section4'
        }],
        liters: [{
          id: 1,
          name: 'Liter'
        }, {
          id: 2,
          name: 'g'
        }, {
          id: 3,
          name: 'pcs'
        }],
        categories: [{
          id: 1,
          name: 'category1'
        }, {
          id: 2,
          name: 'category2'
        }],
        commissionCategories: [{
          id: 1,
          name: 'commission category1'
        }, {
          id: 2,
          name: 'commission category2'
        }],

        productSelected: '2',
        sectionSelected: ['1', '2'],
        deliveryConditions: [
          {
            value: 'Liquid',
            id: '1',

          },
          {
            value: 'Fragile',
            id: '2',

          },
          {
            value: 'Cold',
            id: '3',

          }
        ],
        selectedDeliveryConditions: ['1', '2', '3'],
        literSelected: '1',
        categorySelected: ['2'],
        commissionCategorySelected: '1',
        price: 1111111111111,
        previouslyOrderedDays: 122,
        preparationTime: 122,
        measurement: 1000,
        deliveryAmount: 155,
        keywords: [{
          name: 'keyword1'
        }, {
          name: 'keyword2'
        }, {
          name: 'keyword1'
        }, {
          name: 'keyword2'
        }],
        imgs: ['https://www.pexels.com/photo/flower-roses-red-roses-bloom-15239/', 'https://www.pexels.com/photo/flower-roses-red-roses-bloom-15239/'],
        menuItemActive: true
      };

      for (let i = 0; i < this.item.selectedDeliveryConditions.length; ++i) {
        if (this.item.deliveryConditions[0].id === this.item.selectedDeliveryConditions[i]) {
          this.checked[0] = true;
        }
        if (this.item.deliveryConditions[1].id === this.item.selectedDeliveryConditions[i]) {
          this.checked[1] = true;
        }
        if (this.item.deliveryConditions[2].id === this.item.selectedDeliveryConditions[i]) {
          this.checked[2] = true;
        }
      }
    }
  }

  selectedDeliveryConditions() {
    this.item.selectedDeliveryConditions = [];
    for (let i = 0; i < this.item.deliveryConditions.length; ++i) {
      if (this.checked[i]) {
        this.item.selectedDeliveryConditions.push(this.item.deliveryConditions[i].id);
      }
    }
  }

  //========================== keywords ========================
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Keywords functionality
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (this.item.keywords.length < 21) {
        this.keywordsLengthError = '';
        this.item.keywords.push({name: value.trim()});
      } else {
        this.keywordsLengthError = 'You can add maximum 20 keywords.';
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

// remove keyword
  remove(keyword: Keyword): void {
    const index = this.item.keywords.indexOf(keyword);
    if (index >= 0) {
      this.item.keywords.splice(index, 1);
      this.keywordsLengthError = '';
      // let objDiv = document.getElementById('keywords');
      // objDiv.scrollTop = objDiv.scrollHeight + 50;
    }
  }

  //====================== Errors ====================
  allNamesError = '';
  productSelectedError = '';
  priceError = '';
  keywordsLengthError = '';

  changedName(value) {
    if (this.item.menuItemActive) {
      if (value === '') {
        this.allNamesError = 'Name is required in all languages.';
      } else {
        this.allNamesError = '';
      }
    } else {
      if (value === '') {
        this.allNamesError = 'Name is required.';
      } else {
        this.allNamesError = '';
      }
    }
  }

  changedPrice(value) {
    if (this.item.menuItemActive) {
      if (value === '') {
        this.priceError = 'Price is required.';
      } else {
        this.priceError = '';
      }
    }
  }

  changedProduct(value) {
    if (this.item.menuItemActive) {
      if (value) {
        this.productSelectedError = '';
      } else {
        this.productSelectedError = 'Product is required.';
      }
    }
  }

  selectDescriptionEng = true;
  selectDescriptionRus = false;
  selectDescriptionArm = false;

  // Key Event
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }

  imageUrl: string = null;
  file;

//Upload image
  onFileSelected(event) {
    this.item.imgs = ['https://www.pexels.com/photo/flower-roses-red-roses-bloom-15239/', 'https://www.pexels.com/photo/flower-roses-red-roses-bloom-15239/'];
    console.log(event.target.files);
    this.file = event.target.files[0];
    this.imageUrl = this.file.name;
    console.log(this.imageUrl);
    // const uploadData = new FormData();
    // uploadData.append('file', this.file, this.imageUrls);
    // this.filesService.saveFile(uploadData, 'IMAGE').subscribe(res => {
    //   if (res) {
    //     this.partnerImageUrl = res;
    //     this.data.image = this.partnerImageUrl;
    //   }
    // });
  }

  deleteAttachImg(ind) {
    this.item.imgs.splice(ind, 1);
    // this.imageUrl = null;
  }

  chaneClosePopup = true;

  // forbid to close any popup
  dontClosePopup() {
    this.chaneClosePopup = false;
  }

  // allow to close popup
  closePopup() {
    this.chaneClosePopup = true;
  }

  // activate or deactivate user
  activateNewOrChangeableUser() {
    this.item.menuItemActive ?
      this.item.menuItemActive = false :
      this.item.menuItemActive = true;

    this.allNamesError = '';
    this.productSelectedError = '';
    this.priceError = '';
  }

  // Add menu item save
  saveAddMenuItem() {
    this.selectedDeliveryConditions();

    if (this.item.menuItemActive) {
      if (!this.item.engName || !this.item.rusName || !this.item.armName) {
        this.allNamesError = 'Name is required in all languages.';
        return;
      } else if (!this.item.productSelected) {
        this.allNamesError = '';
        this.productSelectedError = 'Product is required.';
        return;
      } else if (!this.item.price) {
        this.productSelectedError = '';
        this.priceError = 'Price is required.';
        return;
      } else {
        this.priceError = '';
      }
    } else {
      if (!(this.item.armName || this.item.rusName || this.item.engName)) {
        this.allNamesError = 'Name is required.';
        return;
      } else {
        this.allNamesError = '';
      }
    }

    const obj = {
      engName: this.item.engName,
      rusName: this.item.rusName,
      armName: this.item.armName,
      product: this.item.productSelected,
      section: this.item.sectionSelected,
      price: this.item.price,
      measurement: {
        count: this.item.measurement,
        unit: this.item.literSelected
      },
      deliveryAmount: this.item.deliveryAmount,
      deliveryCondition: this.item.selectedDeliveryConditions,
      category: this.item.categorySelected,
      commisionCategory: this.item.commissionCategorySelected,
      keywords: this.item.keywords,
      previouslyOrderedDays: this.item.previouslyOrderedDays,
      preparationTime: this.item.preparationTime,
      descriptionEng: this.item.engDescription,
      descriptionRus: this.item.rusDescription,
      descriptionArm: this.item.armDescription,
      imgUrls: this.item.imgs,
      menuItemActive: this.item.menuItemActive
    };

    console.log(obj, 'Saved Object');
  }


}
