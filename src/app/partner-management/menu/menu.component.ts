// Menu Component.
import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
// export Menu Component
export class MenuComponent implements OnInit {
  menusName = 'Menu';
  menuList = [];
  name = '';
  id: number;
  pageCount: number = 10;
  pagStart = 0;
  pagEnd = 3;
  pages = [];
  pageNumber = 0;

  menuItem = {
    id: null,
    name: '',
    partners: []
  };

  // showWriteNameContent = [];

  constructor() {
  }

  ngOnInit() {
    this.menuList = [
      {
        id: 1,
        name: 'Burger',
        partners: [1, 2, 3, 4, 5]
      },
      {
        id: 2,
        name: 'Burger',
        partners: [1, 2, 3]
      },
      {
        id: 3,
        name: 'Burger',
        partners: [1, 2, 3, 4]
      }
    ];

    // for (let i = 0; i < this.menuList.length; ++i) {
    //   this.nameIsCopiedOrNot[i] = false;
    //   this.showWriteNameContent[i] = false;
    // }

    // this.nameIsCopiedOrNot = true;

    // this.getAllMenues();
    if (this.pagEnd <= this.pageCount) {
      this.pages = [];
      for (let i = this.pagStart; i <= this.pagEnd; ++i) {
        this.pages.push(i);
      }
    } else {
      this.pages = [];
      for (let i = this.pagStart; i <= this.pageCount; ++i) {
        this.pages.push(i);
      }
    }
  }

  changedName(name, ind) {
    if (name.trim()) {
      this.menuList[ind].name = name;
      this.clickBodyOrNot = false;
    } else {
      this.clickBodyOrNot = true;
    }
  }

  createMenu() {
    if (!this.clickBodyOrNot) {
      this.menuItem = {
        id: null,
        name: '',
        partners: []
      };
      this.menuItem.id = this.menuList.length + 1;
      this.menuList.push(this.menuItem);
      this.clickBodyOrNot = true;
    }

  }

  copyAndCreateMenu(copiedObjInd) {
    if (!this.clickBodyOrNot) {
      this.menuItem = JSON.parse(JSON.stringify(this.menuList[copiedObjInd]));
      this.menuItem.id = this.menuList.length + 1;
      this.menuItem.name = '';
      this.menuList.push(this.menuItem);
      this.clickBodyOrNot = true;
    }
  }

  // //Get All Menu
  // getAllMenues(page?) {
  //   this.menuService.getAllMenues(page).subscribe(response => {
  //     if (response) {
  //       console.log(response, '---------------response------------');
  //       this.menuList = response.content;
  //       this.pageCount = response.totalPages;
  //       if (!page && page !== 0) {
  //         this.pageNumber = 0;
  //         for (let i = 0; i < this.pageCount; i++) {
  //           this.pages.push(i);
  //         }
  //       }
  //     }
  //   });
  // }

  //Set page
  setPage(page) {
    this.pageNumber = page;
    // this.getAllMenues(page);
  }

  //Pagination previus functionality
  previus() {
    if (this.pagStart > 0) {
      if (this.pagStart === this.pageNumber) {
        this.pages = [];
        this.pagStart--;
        this.pagEnd--;
        for (let i = this.pagStart; i <= this.pagEnd; ++i) {
          this.pages.push(i);
        }
        this.setPage(this.pageNumber - 1);
      } else {
        this.setPage(this.pageNumber - 1);
      }
    }
  }

//Pagination next functionality

  next() {
    if (this.pagEnd < this.pageCount) {
      if (this.pagEnd === this.pageNumber) {
        this.pages = [];
        this.pagStart++;
        this.pagEnd++;
        for (let i = this.pagStart; i <= this.pagEnd; ++i) {
          this.pages.push(i);
        }
        this.setPage(this.pageNumber + 1);
      } else {
        this.setPage(this.pageNumber + 1);
      }
    }
  }


  showDescription = false;
  menuItemDetails = {};
  partners = ['Burger King Kievyan', 'Burger King Hyusisayin', 'Burger King Kievyan', 'Burger King Hyusisayin', 'Burger King Kievyan', 'Burger King Hyusisayin', 'Burger King Kievyan', 'Burger King Hyusisayin'];

  showDescriptionFunc(ind) {
    this.showDescription = true;
    //------------------- get edited menu partners ------------------------
    this.menuItemDetails = this.menuList[ind];

  }

  clickBodyOrNot = false;

  @ViewChild('myModal') modal: ElementRef;
  openWriteNameModal(e) {
    if (this.clickBodyOrNot) {
      console.dir(e);
      if (e.target.name !== 'createMenu' && e.target.id !== 'createMenu1' && e.target.id !== 'createMenu2' && e.target.id !== 'okBtn' &&  e.target.id  !== 'deleteBtn') {
        this.showModal = true;
      }
    }
  }
  showModal = false;
  closeModal() {
    this.showModal = false;
  }

  deleteModal() {
    this.menuList.pop();
    this.showModal = false;
    this.clickBodyOrNot = false;
  }
  //
  // //Filter Menu By Name
  // getFilterMenuByName() {
  //   console.log(this.name);
  //   this.menuService.getFilterMenuByName(this.name, this.id).subscribe(response => {
  //     if (response) {
  //       this.menuList = response.content;
  //       this.pageCount = response.totalPages;
  //       if (!this.name) {
  //         for (let i = 1; i < this.pageCount; i++) {
  //           this.pages.push(i);
  //         }
  //       } else {
  //         this.pages.length = 1;
  //       }
  //     }
  //   });
  // }
  //
  // //Filter Menu By Id
  // getFilterMenuById() {
  //   this.menuService.getFilterMenuById(this.id, this.name).subscribe(response => {
  //     if (response) {
  //       this.menuList = response.content;
  //       this.pageCount = response.totalPages;
  //       if (!this.id) {
  //         for (let i = 1; i < this.pageCount; i++) {
  //           this.pages.push(i);
  //         }
  //       } else {
  //         this.pages.length = 1;
  //       }
  //     }
  //   });
  // }
}


