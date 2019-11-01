// Partner Menu Component

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Sort } from '@angular/material';
import { PartnerMenuService } from '../../services/partner-menu/partner-menu.service'

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

// Dessert
export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}


// Component
@Component({
  selector: 'partner-menu',
  templateUrl: './partner-menu.component.html',
  styleUrls: ['./partner-menu.component.scss']
})

// export Partner Menu Component
export class PartnerMenuComponent implements OnInit {

showlist = true;
partnersName = "Partners";
panelOpenState = true;
showSections = true;
showSectionscorporate = true;
showSectionscorporateOne = true;
showSectionscorporateTwo = true;
showSectionOne = true;
showSectionTwo = true;
menusName = "Menu";
sectionOne = "Section 1";
sectionTwo = "Section 2";

// Dessert
desserts: Dessert[] = [
  {name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4},
  {name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4},
  {name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6},
  {name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4},
  {name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4},
];

sortedData: Dessert[];

constructor( private partynerMenuService: PartnerMenuService ) {
  this.sortedData = this.desserts.slice();
}

// sort Date
sortData(sort: Sort) {
  const data = this.desserts.slice();
  if (!sort.active || sort.direction === '') {
    this.sortedData = data;
    return;
  }

  this.sortedData = data.sort((a, b) => {
    const isAsc = sort.direction === 'asc';
    switch (sort.active) {
      case 'name': return compare(a.name, b.name, isAsc);
      case 'calories': return compare(a.calories, b.calories, isAsc);
      case 'fat': return compare(a.fat, b.fat, isAsc);
      case 'carbs': return compare(a.carbs, b.carbs, isAsc);
      case 'protein': return compare(a.protein, b.protein, isAsc);
      default: return 0;
    }
  });
}

// Service Type viewValue.
producttypes: Product[] = [
  {value: 'value-0', viewValue: 'Pizza 1'},
  {value: 'value-1', viewValue: 'Pizza 2'},
  {value: 'value-2', viewValue: 'Pizza 3'}
];


// Box Categories 
categoriestypes: boxCategories[] = [
  { value: 'value-0', viewValue: 'Categories 1' },
  { value: 'value-1', viewValue: 'Categories 2' },
  { value: 'value-2', viewValue: 'Categories 3' }
];


// Attach menu modal 
attachs: any = [
  { id: '01', name: 'Burger King Menu 1' },
  { id: '02', name: 'Burger King Menu 3' },
  { id: '03', name: 'Tumanyani shawarma menu 1' },
  { id: '04', name: 'Tumanyani shawarma menu 3' },
  { id: '05', name: 'Burger King Menu 1' },
  { id: '06', name: 'Burger King Menu 3' },
  { id: '07', name: 'Tumanyani shawarma menu 1' },
  { id: '08', name: 'Tumanyani shawarma menu 3' },
  { id: '09', name: 'Burger King Menu 1' },
  { id: '10', name: 'Burger King Menu 3' },
  { id: '11', name: 'Tumanyani shawarma menu 1' },
  { id: '12', name: 'Tumanyani shawarma menu 3' },
  { id: '13', name: 'Burger King Menu 1' },
  { id: '14', name: 'Burger King Menu 1' },
  { id: '15', name: 'Burger King Menu 3' },
]


// any
elems: any = [
  { id: '01' , product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet, conse orem ipsum dolor sit amensec...'},
  { id: '02', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet, conse orem ipsum dolor sit amensec...'},
  { id: '03', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet, conse orem ipsum dolor sit amensec...'},
  { id: '03', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet, conse orem ipsum dolor sit amensec...'},
  { id: '04', product: 'Pizza', measurement: 'Liter',  name: 'Margarita Pizza', price: '2000', dectription: 'Lorem ipsum dolor sit amet, conse orem ipsum dolor sit amensec...'}
];

//  section One Elems
sectionOneElems = [ 'ID', 'Product', 'Measurement', 'Name', 'Price', 'Dectription', 'tools' ]


// Partner Aoutocomplete.
myControl = new FormControl();
options: string[] = ['One', 'Two', 'Three'];
filteredOptions: Observable<string[]>;

applyFilter(filterValue: string, number) {
  this.elems.filter = filterValue.trim().toLowerCase();
}

ngOnInit() {
  // aoutocomplete filter partnertype option
  this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.options.filter(option => option.toLowerCase().includes(filterValue));
}

// get All Menu
getAllMenu() {
  this.partynerMenuService.getAllMenu()
  .subscribe(
    response => {
      if (response) {
        this.partynerMenuService = response
      }
    });
  }
}

// Sorting in table 
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}