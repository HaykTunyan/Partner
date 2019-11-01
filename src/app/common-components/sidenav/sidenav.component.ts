// Sidenav Component

import {Component, OnInit} from '@angular/core';
import { CreateProductService } from '../../services/create-product/create-product.service';
import {BrandService} from '../../services/brand/brand.service';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

// Export Sidenav Component
export class SidenavComponent implements OnInit {

  constructor(private productService: CreateProductService,
              private brandService: BrandService) {
  }

  products;
  newProductName;
  newBrandName;
  brands
  filterText;
  servicecategorys;
  servicetypes;
  commissioncategorys;
  sectioncategorys;

  // Table header
  showlist = false;
  showtext = false;
  active = false;
  editlist = false;
  product;
  productId;
  showSettings = false;
  showCampaign = false;

  menuList = [
    {
      name: 'Partner List',
      icon: 'store',
      routerLink: 'partner-list'
    },
    {
      name: 'Menu',
      icon: 'restaurant',
      routerLink: 'menu'
    },
    {
      name: 'Product ',
      icon: 'local_pizza',
      routerLink: 'partner-list',
      onclick: 'productModal.show()'
    },
    {
      name: 'Legal Entities',
      icon: 'assignment_ind',
      routerLink: 'legal-entities'
    },
    {
      name: 'Brand List',
      icon: 'local_offer',
      routerLink: 'brand-list'
    },
    {
      name: 'Partner Category',
      icon: 'style',
      routerLink: 'partner-category'
    },
    {
      name: 'Service Type',
      icon: 'room_service',
      routerLink: 'service-type'
    },
    {
      name: 'Service Category',
      icon: 'category',
      routerLink: 'service-category'
    },
    {
      name: 'Commission Category',
      icon: 'widgets',
      routerLink: 'commision-category'
    },
    {
      name: 'Section List',
      icon: 'fastfood',
      routerLink: 'section-list'
    },
    {
      name: 'Section Category',
      icon: 'view_comfy',
      routerLink: 'section-category'
    },
  ];

  settings = [
    {
      name: 'Country',
      icon: 'public',
      routerLink: 'settings/country'
    }, {
      name: 'Backup',
      icon: 'backup',
      routerLink: 'settings/backup'
    }, {
      name: 'Order Type',
      icon: 'receipt',
      routerLink: 'settings/order-type'
    }, {
      name: 'Flow Settings',
      icon: '360',
      routerLink: 'settings/flow-settings'
    }, {
      name: 'Delivery Settings',
      icon: 'motorcycle',
      routerLink: 'settings/delivery'
    }
  ];

  campaign = [
    {
      name: 'Campaign',
      icon: 'toys',
      routerLink: 'campaign-management/campaign'
    },
    {
      name: 'Gifts Inventory',
      icon: 'card_giftcard',
      routerLink: 'campaign-management/giftsInventory'
    }
  ];
  userData;
  roleNames: any;

  ngOnInit() {
    this.getAllProduct();
    this.getUserDataFromLocalStorage();
    this.disabledOrEnabledButtons();
    this.getAllBrands();
  }

  getAllProduct() {
    this.productService.getAllProduct()
    .subscribe (response => {
      if (response) {
        this.products = response;
    }
  }
  );
}
getAllBrands() {
    this.brandService.getAllBrand().subscribe(res => {
      this.brands = res.content;
    });
}

addProduct() {
  this.productService.addProduct({
      name: this.newProductName
    })
  .subscribe(
    response => {
        this.getAllProduct();
    });
}
  addBrand() {
    this.brandService.addBrand({
      name: this.newBrandName
    })
      .subscribe(
        response => {
          this.getAllBrands();
        });
  }
  deleteBrand(id) {
    this.brandService.deleteBrandById(id).subscribe(res => {
      this.getAllBrands();
    });
  }

getProductByName(name) {
  this.productService.getProductByName(name)
  .subscribe (
    response => {
      if (response) {
        this.product = response;
        this.productId = response.id;
      }
    } 
  )
}


  // addnewCreate(valueCreate: string) {
  //   if(valueCreate) {
  //     this.creates.push(valueCreate);
  //   }
  // }
  
  // deleteCreate(valueCreate: string) {
  //   if(valueCreate) {
  //     this.creates.splice ;
  //   }
  // }

  // deleteItem(id) {
  //   console.log(id)
  //   this.getProductByName(name);
  //   setTimeout(() => {
  //     this.deleteProductById(this.productId);
  //   });
  // }
  deleteItem(id) {
    this.productService.deleteProductById(id)
      .subscribe (
        response => {
          this.getAllProduct();
        });
  }

  commissions() {
  }

  addSection() {
  }

  addCategory() {
  }

  addTypes() {
  }

  // get user data from local storage.
  getUserDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('menu-user'));
    if ( data ) {
      if (data.userDto) {
        this.userData = data.userDto;
      }
    }
  }
  // enable and disable dashboard buttons.
  disabledOrEnabledButtons() {
    if (Array.isArray(this.userData.roleDtos)) {
      this.roleNames = {};
      for (let i = 0; i <  this.userData.roleDtos.length; i++) {
        this.roleNames[this.userData.roleDtos[i].name] = true;
      }
    }
  }
}
