// Data Table Component

import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PartnersService } from '../../services/partners/partners.service';

// Table header

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

/**
 * Data Table Component
 */


/**
 * PeriodicElement
 */
export interface PeriodicElement {
  position: number;
  partner: string;
  status: string;
  zonearea: string;
  servicetype: string;
  phone: string;
  zip: string;
  area: string;
}

/**
 * Element Data for PeriodicElement
 */
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1,  partner: 'Pizza Hut', status: 'Open', zonearea: 'Ajapnyak', servicetype: 'Italian', phone: '+374 98 222 222', zip: '0069', area: 'Yerevan'},
  {position: 2,  partner: 'Elie s Lahmajun', status: 'Closed', zonearea: 'Arabkir', servicetype: 'Greek', phone: '+374 94 333 111', zip: '0011', area: 'Tbilisi' },
  {position: 3,  partner: 'Black Angus', status: 'Open', zonearea: 'Avan', servicetype: 'Armenian', phone: '+374 44 444 569', zip: '0098', area: 'Minsk'},
  {position: 4,  partner: 'Burger King', status: 'Օpen', zonearea: 'Davtashen', servicetype: 'Russian', phone: '+374 44 444 569', zip: '0098', area: 'Yerevan'},
  {position: 5,  partner: 'Mr GYROS', status: 'Closed', zonearea: 'Erebuni', servicetype: 'Eroupean', phone: '+374 (010) 222 000' , zip: '0056', area: 'Gyumri'},
  {position: 6,  partner: 'Tumanyan Shaurma', status: 'Closed', zonearea: 'Kanaker-Zeytun', servicetype: 'Franch', phone: '+374 91 222 222', zip: '0046', area: 'Vanadzor'},
  {position: 7,  partner: 'Karas', status: 'Open', zonearea: 'Malatia-Sebastia', servicetype: 'Armerican', phone: '+374 94 222 222', zip: '0092', area: 'Abovyan'},
  {position: 8,  partner: 'GGs Pizza', status: 'Open', zonearea: 'Shengavit', servicetype: 'Eroupean', phone: '+374 99 222 222', zip: '0028', area: 'Dilijan'},
  {position: 9,  partner: 'Durum', status: 'Open', zonearea: 'Nor Nork', servicetype: 'Italian', phone: '+374 98 222 222', zip: '0078', area: 'Hrazdan'},
  {position: 10, partner: 'Tacos', status: 'Open', zonearea: 'Nork-Marash	', servicetype: 'Eroupean', phone: '+374 98 222 222', zip: '0085', area: 'Kapan'},
  {position: 11,  partner: 'Pizza Hut', status: 'Open', zonearea: 'Ajapnyak', servicetype: 'Italian', phone: '+374 98 222 222', zip: '0069', area: 'Yerevan'},
  {position: 12,  partner: 'Elie s Lahmajun', status: 'Closed', zonearea: 'Arabkir', servicetype: 'Greek', phone: '+374 94 333 111', zip: '0011', area: 'Tbilisi' },
  {position: 13,  partner: 'Black Angus', status: 'Open', zonearea: 'Avan', servicetype: 'Armenian', phone: '+374 44 444 569', zip: '0098', area: 'Minsk'},
  {position: 14,  partner: 'Burger King', status: 'Օpen', zonearea: 'Davtashen', servicetype: 'Russian', phone: '+374 44 444 569', zip: '0098', area: 'Yerevan'},
  {position: 15,  partner: 'Mr GYROS', status: 'Closed', zonearea: 'Erebuni', servicetype: 'Eroupean', phone: '+374 (010) 222 000' , zip: '0056', area: 'Gyumri'},
  {position: 16,  partner: 'Tumanyan Shaurma', status: 'Closed', zonearea: 'Kanaker-Zeytun', servicetype: 'Franch', phone: '+374 91 222 222', zip: '0046', area: 'Vanadzor'},
  {position: 17,  partner: 'Karas', status: 'Open', zonearea: 'Malatia-Sebastia', servicetype: 'Armerican', phone: '+374 94 222 222', zip: '0092', area: 'Abovyan'},
  {position: 18,  partner: 'GGs Pizza', status: 'Open', zonearea: 'Shengavit', servicetype: 'Eroupean', phone: '+374 99 222 222', zip: '0028', area: 'Dilijan'},
  {position: 19,  partner: 'Durum', status: 'Open', zonearea: 'Nor Nork', servicetype: 'Italian', phone: '+374 98 222 222', zip: '0078', area: 'Hrazdan'},
  {position: 20, partner: 'Tacos', status: 'Open', zonearea: 'Nork-Marash	', servicetype: 'Eroupean', phone: '+374 98 222 222', zip: '0085', area: 'Kapan'},
];



@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

// export Data Table Component 
export class DataTableComponent implements OnInit {

  constructor (private partnersService: PartnersService) {}
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

//

  /** Displaye Columes for data table string. */
 displayedColumns: string[] = ['select', 'position', 'partner', 'status', 'zonearea', 'servicetype', 'phone', 'zip', 'area', 'tools'];
 dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
 selection = new SelectionModel<PeriodicElement>(true, []);

 /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
   const numSelected = this.selection.selected.length;
   const numRows = this.dataSource.data.length;
   return numSelected === numRows;
 }

 /** Selects all rows if they are not all selected; otherwise clear selection. */
 masterToggle() {
   this.isAllSelected() ?
       this.selection.clear() :
       this.dataSource.data.forEach(row => this.selection.select(row));
 }

 // filter for table.
 applyFilter(filterValue: string, number) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
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
menusName = "Menu";



// partners []
  partners: any;

// partnerListElements
partnerListElements = [
  {name: 'Partner Name', checked: true},
  {name: 'Area', checked: false},
  {name: 'Zone', checked: false},
  {name: 'Phone Number', checked: true},
  {name: 'Order Acceptance method', checked: false},
  {name: 'Partner Type', checked: true},
  {name: 'Brand', checked: true},
  {name: 'Legal Entity', checked: false },
  {name: 'Service Type', checked: false},
  {name: 'Partner Category', checked: false},
  {name: 'Events', checked: false},
  {name: 'Campaigns', checked: false},
  {name: 'Billing Cycle number', checked: false},
  {name: 'Billing Cycle Days, months, weeks', checked: false},
  {name: 'Billing cycle start date', checked: false },
  {name: 'Contract Number', checked: false},
  {name: 'Grace period', checked: false},
  {name: 'Max Credit Limit', checked: false},
  {name: 'Order Payment', checked: false},
  {name: 'Enabled/Disabled ', checked: true},
  {name: 'Open/Closed', checked: true}
];

// table two
elems: any = [
  { id: '01' , product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet', tools: 'Tools'},
  { id: '02', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet', tools: 'Tools'},
  { id: '03', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet', tools: 'Tools'},
  { id: '03', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet', tools: 'Tools'},
  { id: '04', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet', tools: 'Tools'}
];

// sectionOneElements
sectionOneElems = [ 'ID', 'Product', 'Measurement', 'Name', 'Price', 'Dectription', 'tools' ]


//


elements: any = [
  {id: 1, first: 'Mark', last: 'Otto', handle: '@mdo'},
  {id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat'},
  {id: 3, first: 'Larry', last: 'the Bird', handle: '@twitter'},
];

headElements = ['ID', 'First', 'Last', 'Handle'];



// Aoutocomplete


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
    .pipe (
      startWith(''),
      map(value => this._filter(value))
    );

    // aoutocomplete filter partnertype option
    this.filteredPartnertypes = this.TypeControl.valueChanges
    .pipe (
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
    this.partners.forEach(item => {
      item.checked = this.selectedAll;
    });
  }
  //check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.partners.every(item => {
      return item.checked === true;
    });
  }
  //check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.partners.filter(item => {
      return item.checked === true;
    });
  }


  //get all Partners
  getAllPartner() {
    this.partnersService.getAllPartner().subscribe(
      response => {
        if (response) {
          this.partners = response;
        }
      });
  }


}
