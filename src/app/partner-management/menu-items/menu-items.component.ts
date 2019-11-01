// Menu Component

import {Component, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {MatSort} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {PartnersService} from '../../services/partners/partners.service';


/**
 * Status
 */
export interface Status {
  value: string;
  viewValue: string;
}

/**
 * Rest
 */
export interface Rest {
  value: string;
  viewValue: string;
}

// Keyword
export interface Keyword {
  name: string;
}

// Product
export interface Product {
  value: string;
  viewValue: string;
}

// Box Categories
export interface boxCategories {
  value: string;
  viewValue: string;
}

/**
 * Area
 */
export interface Area {
  value: string;
  viewValue: string;
}

/**
 * Service
 */
export interface Service {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})

// export Menu Items Component
export class MenuItemsComponent implements OnInit {

  constructor(private partnersService: PartnersService) {
  }

  filterText;

// Table header
  showlist = true;

  // Status viewValue.
  statuses: Status[] = [
    {value: 'status-1', viewValue: 'Enabled'},
    {value: 'status-2', viewValue: 'Disabled'}
  ];

// Rest viewValue.
  rests: Rest[] = [
    {value: 'rest-1', viewValue: 'Open'},
    {value: 'rest-2', viewValue: 'Close'}
  ];

  isAllSelected() {
  }

  masterToggle() {
  }

  // filter for table.
  applyFilter(filterValue: string, number) {
  }

  // shot for column in table.
  @ViewChild(MatSort) sort: MatSort;

  // Service Type viewValue.
  servicetypes: Service[] = [
    {value: 'italian-0', viewValue: 'Italian'},
    {value: 'greek-1', viewValue: 'Greek'},
    {value: 'armenian-2', viewValue: 'Armenian'}
  ];


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

// keyword
  keywords: Keyword[] = [
    {name: 'Pizza'},
  ];

// add chip input
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
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

// title name
  menusName = 'Menu';

// partners []
  menus: any;

// partnerListElements
  menuListElements = [
    {name: 'S/N', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Product', checked: true, sort: {name: 'product', status: ''}},
    {name: 'Status', checked: true, sort: {name: 'status', status: ''}},
    {name: 'Name', checked: true, sort: {name: 'productName', status: ''}},
    {name: 'Condition', checked: true, sort: {name: 'condition', status: ''}},
    {name: 'Measurement', checked: true, sort: {name: 'measurement', status: ''}},
    {name: 'Price', checked: true, sort: {name: 'price', status: ''}},
    {name: 'Partner', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Section', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Additional Delivery Amount', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Category', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Commision Category', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Keywords', checked: false, sort: {name: 'description', status: ''}},
    {name: 'To Be Ordered Previously', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Preparation Time', checked: false, sort: {name: 'description', status: ''}},
    {name: 'Description', checked: true, sort: {name: 'description', status: ''}},
  ];

// City aoutocomplete
  BrandControl = new FormControl();
  TypeControl = new FormControl();
  brands: string[] = ['Yerevan', 'Minsk', 'Tbilisi'];
  partnertypes: string[] = ['Yerevan', 'Yerevan', 'Yerevan'];
  filteredBrands: Observable<string[]>;
  filteredPartnertypes: Observable<string[]>;


// ngOnint
  ngOnInit() {
    this.getAllPartner();


    // aoutocomplete filter city option
    this.filteredBrands = this.BrandControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    // aoutocomplete filter partnertype option
    this.filteredPartnertypes = this.TypeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.brands.filter(city => city.toLowerCase().includes(filterValue));
    return this.partnertypes.filter(partnertype => partnertype.toLowerCase().includes(filterValue));
  }

//select all checkbox
  selectAll() {
    this.menus.forEach(item => {
      item.checked = this.selectedAll;
    });
  }

  //check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.menus.every(item => {
      return item.checked === true;
    });
  }

  //check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.menus.filter(item => {
      return item.checked === true;
    });
  }

  //get all Partners
  getAllPartner() {
    this.menus = [
      {
        id: '01',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '02',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '03',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '04',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '11',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '12',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '13',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      },
      {
        id: '14',
        product: 'product',
        status: 'status',
        name: 'name',
        deliveryCondition: 'deliveryCondition',
        measurement: 'measurement',
        price: '11111111111111',
        description: 'description',
        partner: 'Partner',
        section: 'section',
        deliveryAmount: 1111111,
        category: 'dada,aadad',
        commisioncategory: 'category',
        keywords: ['sfsf', 'afaf'],
        previouslyOrderedDays: 5,
        preparationTime: 20,
        checked: false,
        active: true
      }
    ];
  }

}
