// Option List Component

import {Component, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import {MatSort} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {PartnersService} from '../../services/partners/partners.service';
import {ActivatedRoute} from '@angular/router';


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
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.scss']
})

// export Option List Component
export class OptionListComponent implements OnInit {

  constructor(private partnersService: PartnersService, private route: ActivatedRoute) {
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
  options: any;

// optionListElements
  optionListElements = [
    {name: 'Option Name', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Attached Menu Items', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Status', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Multiple Choice', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Maximum number of Selections', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Minimum number of Selections', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Price', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Limit', checked: true, sort: {name: 'name', status: ''}},
  ];

// City aoutocomplete
  optionName = new FormControl();
  BrandControl = new FormControl();
  TypeControl = new FormControl();
  brands: string[] = ['Yerevan', 'Minsk', 'Tbilisi'];
  partnertypes: string[] = ['Yerevan', 'Yerevan', 'Yerevan'];
  filteredBrands: Observable<string[]>;
  filteredPartnertypes: Observable<string[]>;
  filteredOptionName: Observable<string[]>;

  id: any;

// ngOnint
  ngOnInit() {

    if (this.id) {
      this.id = this.route.snapshot.paramMap.get('id');
      // --------------- Get All Partner By This ID ----------------
    } else {
      this.getAllOptions();
    }

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

    this.filteredOptionName = this.optionName.valueChanges
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
    this.options.forEach(item => {
      item.checked = this.selectedAll;
    });
  }

  //check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.options.every(item => {
      return item.checked === true;
    });
  }

  //check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.options.filter(item => {
      return item.checked === true;
    });
  }

  getAllOptions() {
    this.options = [{
      name: 'saaDAd',
      attachedMenuItems: '4545,4545,5454',
      status: 'aaaaaaa',
      multipleChoice: 'ddddd',
      maxNumberOfSelections: '5',
      minNumberOfSelections: '1',
      price: 'yes',
      limit: 4,
      checked: false
    },
      {
        name: 'dsdsaaDAd',
        attachedMenuItems: '4545,4545,5454',
        status: 'aaaaaaa',
        multipleChoice: 'ddddd',
        maxNumberOfSelections: '5',
        minNumberOfSelections: '1',
        price: 'yes',
        limit: 4,
        checked: false
      },
      {
        name: 'aasaaDAd',
        attachedMenuItems: '4545,4545,5454',
        status: 'aaaaaaa',
        multipleChoice: 'ddddd',
        maxNumberOfSelections: '5',
        minNumberOfSelections: '1',
        price: 'yes',
        limit: 4,
        checked: false
      },
      {
        name: 'bbsaaDAd',
        attachedMenuItems: '4545,4545,5454',
        status: 'aaaaaaa',
        multipleChoice: 'ddddd',
        maxNumberOfSelections: '5',
        minNumberOfSelections: '1',
        price: 'yes',
        limit: 4,
        checked: false
      },
    ];
  }

  // function for create sort params and send back end.
  sortButton(index) {
    if (!this.optionListElements[index].sort.status) {
      this.optionListElements[index].sort.status = 'asc';
    } else if (this.optionListElements[index].sort.status === 'asc') {
      this.optionListElements[index].sort.status = 'desc';
    } else {
      this.optionListElements[index].sort.status = 'asc';
    }
    for (let i = 0; i < this.optionListElements.length; i++) {
      if (i !== index) {
        this.optionListElements[i].sort.status = '';
      }
    }
    // this.isFilterStart = true;
    // this.sortBy = this.optionListElements[index].sort;
    // this.paginationCount = 0;
    // this.getAllOptions();
  }

  showDescription = false;
  optionDetails = [];
  menuIdMenuItemId = {};

  showDescriptionFunc(ind) {
    this.showDescription = true;
    //------------------- get selected option details by this ind------------------------

    this.menuIdMenuItemId = {
      menuId: 15,
      menuItemId: 18
    };

    this.optionDetails = [
      {
        name: 'menu name 1',
        items: ['menu item 1', 'menu item 3', 'menu item 4']
      },
      {
        name: 'menu name 2',
        items: ['menu item 1', 'menu item 3', 'menu item 4']
      },
      {
        name: 'menu name 3',
        items: ['menu item 1', 'menu item 3', 'menu item 4']
      }, {
        name: 'menu name 4',
        items: ['menu item 1', 'menu item 3', 'menu item 4']
      }, {
        name: 'menu name 5',
        items: ['menu item 1', 'menu item 3', 'menu item 4']
      },
    ]
  }

  // // get 20 users from beck end.
  // getUserList(page = 0, count = 20) {
  //   if (this.isFilterStart) {
  //     this.userManagement.getByFilter(this.filter, page, count, this.sortBy).subscribe((data) => {
  //       if (data) {
  //         this.data = data;
  //         if (page === 0) {
  //           this.users = this.data.content;
  //         } else {
  //           const concatArray = this.data.content;
  //           this.users = this.users.concat(concatArray);
  //         }
  //         this.getNewUsers = !!this.data.content[19];
  //       }
  //       this.noServer = false;
  //     }, error => {
  //       if (error.status === 401 || error.status === 403) {
  //         this.logout();
  //       }
  //       this.noServer = true;
  //     });
  //   } else {
  //     this.userManagement.getUsersByPagination(page, count).subscribe((data) => {
  //       if (data) {
  //         if (page === 0) {
  //           this.users = data;
  //         } else {
  //           const concatArray = data;
  //           this.users = this.users.concat(concatArray);
  //         }
  //         this.getNewUsers = !!data[19];
  //       }
  //     }, error => {
  //       if (error.status === 401 || error.status === 403) {
  //         this.logout();
  //       }
  //     });
  //   }
  //   this.paginationCount++;
  // }

  // //get all Options
  // getAllPartner() {
  //   this.partnersService.getAllPartner().subscribe(
  //     response => {
  //       if (response) {
  //         this.options = response;
  //       }
  //     });
  // }

}
