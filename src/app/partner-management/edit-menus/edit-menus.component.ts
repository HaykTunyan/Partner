import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Keyword} from '../add-partner/add-partner.component';
import {FilesService} from '../../services/files/files.service';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs';

interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-edit-menus',
  templateUrl: './edit-menus.component.html',
  styleUrls: ['./edit-menus.component.scss'],
  viewProviders: [DragulaService],
})
export class EditMenusComponent implements OnInit, OnDestroy {

  showMenuPage = true;
  showAddMenuModal = false;

  subs = new Subscription();

  constructor(private dragulaService: DragulaService, private route: ActivatedRoute, public dialog: MatDialog, private filesService: FilesService) {
    // dragulaService.createGroup('ooooo', {
    //   copy: (el, source) => {
    //     console.log(el, '******1*******', source);
    //
    //     return source.id === 'header';
    //   },
    //   accepts: (el, target, source, sibling) => {
    //     // To avoid dragging from right to left container
    //     return target.id !== 'header';
    //   }
    // });

    this.subs.add(this.dragulaService.drag('ooooo')
      .subscribe(({name, el, source}) => {
        console.dir(el);
        console.log("///////////////////////////////");
      })
    );
    this.subs.add(this.dragulaService.drop('ooooo')
      .subscribe(({name, el, target, source, sibling}) => {
        console.log(name, '----', el);
        console.dir(el);
        this.controlSection ? this.showSection[el.id] = false : this.showSection[el.id] = true;
      }));

    // // some events have lots of properties, just pick the ones you need
    // this.subs.add(this.dragulaService.dropModel("ooooo")
    //   // WHOA
    //   // .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
    //     .subscribe(({ sourceModel, targetModel, item }) => {
    //       // ...
    //     })
    // );
    //
    // // You can also get all events, not limited to a particular group
    // this.subs.add(this.dragulaService.drop()
    //   .subscribe(({ name, el, target, source, sibling }) => {
    //     // ...
    //   })
    // );
  }

  xxx(ind, event) {
    console.dir(event);
    // if (event.target.name !== 'notDrag') {
    this.showSection[ind] = !this.controlSection;
    this.showSection[ind] = !this.showSection[ind];
    // }
  }

  ngOnInit() {
    for (let i = 0; i < this.menus.length; ++i) {
      this.showSection[i] = true;
    }
    this.id = this.route.snapshot.paramMap.get('id');
    // this.editMenusService.getAllData(this.id).subscribe((data) => {
    //   this.data = data;
    // });
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
  }

  id: any;

  showSection = [];
  controlSection = false;

  // setShowSection(ind) {
  //   this.showSection[ind] === false ? this.showSection[ind] = true : this.showSection[ind] = false;
  // }

  // down(ind) {
  //   console.log(ind, "****************")
  //   if (this.controlSection === true) {
  //     this.showSection[ind] = true;
  //   } else {
  //     this.showSection[ind] === false ? this.showSection[ind] = true : this.showSection[ind] = false;
  //   }
  // }

  openAddMenuItemModal = function () {
    this.showMenuPage = false;
    this.showAddMenuModal = true;
  };

// menuListElements
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

  selectedAll: any;
  selectedOne: any;

  //select all checkbox
  selectAll() {
    for (let i = 0; i < this.menus.length; ++i) {
      this.menus[i].forEach(item => {
        item.checked = this.selectedAll;
      });
    }
  }

  // check all checkbox selected
  checkIfAllSelected() {
    for (let i = 0; i < this.menus.length; ++i) {
      this.selectedAll = this.menus[i].every(item => {
        return item.checked === true;
      });
    }
  }

  //check at list one checkbox selected
  checkIfOneSelected() {
    for (let i = 0; i < this.menus.length; ++i) {
      this.selectedOne = this.menus[i].filter(item => {
        return item.checked === true;
      });
    }
  }

  // get 20 gifts from beckend.

  getUserList(page = 0, count = 20) {
  }

  sortButton(index) {
    if (!this.menuListElements[index].sort.status) {
      this.menuListElements[index].sort.status = 'asc';
    } else if (this.menuListElements[index].sort.status === 'asc') {
      this.menuListElements[index].sort.status = 'desc';
    } else {
      this.menuListElements[index].sort.status = 'asc';
    }
    for (let i = 0; i < this.menuListElements.length; i++) {
      if (i !== index) {
        this.menuListElements[i].sort.status = '';
      }
    }
    // this.isFilterStart = true;
    // this.sortBy = this.giftListElements[index].sort;
    // this.paginationCount = 0;
    this.getUserList();
  }


  menus = [[
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
    }
  ],
    [
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
    ]
  ];

  closeAddMenuItemModal(data) {
    console.log(data, '*********************');
    this.showMenuPage = true;
    this.tool = '';
  };

  tool: string;
  editedItem: object;

  edit(ind, itemInd) {
    this.editedItem = {
      name: 'edit'
    };
    this.tool = 'edit';
    this.openAddMenuItemModal();
  }
}

