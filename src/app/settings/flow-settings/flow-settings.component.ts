import { Component, OnInit } from '@angular/core';
import {FlowSettingsService} from '../../services/settings/flow-settings.service';
import { FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';


@Component({
  selector: 'app-flow-settings',
  templateUrl: './flow-settings.component.html',
  styleUrls: ['./flow-settings.component.scss']
})
export class FlowSettingsComponent implements OnInit {
  amountFormControl = new FormControl( '', [
  ]); // form for amount input.
  amountValue = '';
  paymentTypeFormControl = new FormControl( '', [
  ]); // form for amount payment.
  orderFormControl = new FormControl( '', [

  ]); // form for user's order input.
  paymentTypeValue = '';
  scrollData = {
    scroll: 0,
    height: 0
  }; // scroll and content height data for table pagination.
  paymentTypeIndex; // payment type index.
  orderValue = ''; // user's order input value.
  flowStopData: any = []; // flow stop saved data array.
  payments: any = []; // payments array from back end for select option.
  userOrderArray = [
    {name: 'first', key: 'FIRST'},
    {name: 'second', key: 'SECOND'},
    {name: 'third', key: 'THIRD'}]; // user orders data for select option.
  userOrdersKeys = {
    first: 'FIRST',
    second: 'SECOND',
    third: 'THIRD'
  }; // user's orders keys bay names.
  userOrdersName = {
    FIRST: 'first',
    SECOND: 'second',
    THIRD: 'third'
  }; // user's order names buy keys.
  isPaymentSelectOptionOpen = false; // variable for open or close payment popup.
  isOrdersSelectOptionOpen = false; // variable for open or close orders popup.
  plannedDifference = ''; // planed difference input value.
  warningTime = ''; // warning time input value.
  alertTime = ''; // alert time input value.
  cancelTime = ''; // cancel time input validation.
  generalAcceptableStatus: any = {
  'id': null,
  'plannedDifference': null,
  'warningTime': null,
  'warningStatus': null,
  'alertTime': null,
  'alertStatus': null,
  'cancelTime': null,
  'cancelStatus': null
}; // object general acceptable status for send data to backend.
  sendGeneralAcceptableStatusTimer: any; // variable for setTimeOut to send data to backend.
  IsEdit = false;
  constructor(private flowData: FlowSettingsService, private router: Router) { }
  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
     this.getPayments();
     this.getFlowStop();
     this.getGeneralAcceptableStatus();
  }
  // log out function.
  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('menu-user');
  }

  // check user authentication and role status.
  decideUserStatus(): boolean {
    const menuUser = JSON.parse(localStorage.getItem('menu-user'));
    if (menuUser) {
      if (menuUser.token && menuUser.userDto) {
        if (Array.isArray(menuUser.userDto.roleDtos)) {
          for (let i = 0; i < menuUser.userDto.roleDtos.length; i++) {
            if (menuUser.userDto.roleDtos[i].name === 'Flow Management') {
              if (menuUser.userDto.roleDtos[i].action === 'EDIT') {
                i = Infinity;
                return true;
              } else if (menuUser.userDto.roleDtos[i].action === 'VIEW') {
                i = Infinity;
                return false;
              }
            }
          } this.logout();
        } else {
          this.logout();
        }
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }
  // scroll event function for getting scrollTop and content height.
  scroll(scroll, height) {
    this.scrollData = {
      scroll,
      height
    };
  }
  // validation double number for inputs.
  doubleInputKeypress (event) {
    if (isNaN(+(this.amountFormControl.value + event.key)) || event.charCode === 32) {
      return false;
    }
  }
  // delete value select option in time press backspace.
  clearSelectOption (event, status) {
    if (event.keyCode === 8) {
      this[status] = '';
    } else if (event.keyCode === 46) {
      return false;
    }
  }
  // function for close option in selectOptions.
  closeSelectOption(status) {
    this[status] = false;
  }
  // get value from selectOptions.
  selectOption (value, index, status) {
    this[status] = false;
    if (status === 'isPaymentSelectOptionOpen') {
      this.paymentTypeValue = value.name;
      this.paymentTypeIndex = index;
    } else if ('isOrdersSelectOptionOpen') {
      this.orderValue = value.name;
    }
  }
  // open selectOptions.
  openSelectOption(status) {
    this.leaveErrors();
    this[status] = true;
  }
  // get flow stop data from backend.
  getFlowStop() {
    this.flowData.getFlowStop().subscribe(data => {
      this.flowStopData = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // get payments data from backend.
  getPayments() {
    this.flowData.getPayments().subscribe(data => {
     this.payments = data;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // send flow stop data to backend.
  sendFlowStops() {
    this.flowData.sendFlowStops(this.flowStopData).subscribe( data => {
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // get general acceptable statuses from backend.
  getGeneralAcceptableStatus () {
    this.flowData.getGeneralAcceptableStatus().subscribe(data => {
      this.generalAcceptableStatus = data;
      this.generalAcceptableStatus.alertTime ? this.alertTime = this.generalAcceptableStatus.alertTime : this.alertTime = '';
      this.generalAcceptableStatus.warningTime ? this.warningTime = this.generalAcceptableStatus.warningTime : this.warningTime = '';
      this.generalAcceptableStatus.plannedDifference ?
        this.plannedDifference = this.generalAcceptableStatus.plannedDifference :
        this.plannedDifference = '';
      this.generalAcceptableStatus.cancelTime ? this.cancelTime = this.generalAcceptableStatus.cancelTime : this.cancelTime = '';
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
 // send general acceptable statuses to backend.
  sendGeneralAcceptableStatus() {
    this.generalAcceptableStatus.alertTime = +this.alertTime;
    this.generalAcceptableStatus.warningTime = +this.warningTime;
    this.generalAcceptableStatus.plannedDifference = +this.plannedDifference;
    this.generalAcceptableStatus.cancelTime = +this.cancelTime;
    this.flowData.sendGeneralAcceptableStatus(this.generalAcceptableStatus).subscribe(data => {
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }
  // clear new stop data and errors on inputs.
  clearNewStop() {
    this.paymentTypeValue = '';
    this.orderValue = '';
    this.amountValue = '';
    this.amountFormControl = new FormControl( '', []);
    this.paymentTypeFormControl = new FormControl( '', []);
    this.orderFormControl = new FormControl( '', []);
  }
  // to heights inputs errors
  leaveErrors () {
    const localValue1 = this.amountValue, localValue2 = this.paymentTypeValue, localValue3 = this.orderValue ;
      this.amountFormControl = new FormControl( localValue1, []);
      this.paymentTypeFormControl = new FormControl( localValue2, []);
      this.orderFormControl = new FormControl( localValue3, []);
  }
  // add flow stop when it valid.
  addFlowStop() {
    if (!this.amountValue || !this.paymentTypeValue || !this.orderValue) {
      if (!this.amountValue) {
        this.amountFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.amountFormControl.markAsTouched();
      }
      if (!this.paymentTypeValue) {
        this.paymentTypeFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.paymentTypeFormControl.markAsTouched();
      }
      if (!this.orderValue) {
        this.orderFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.orderFormControl.markAsTouched();
      }
    } else {
      this.flowStopData.unshift({
        'orderAmount': +this.amountValue,
        'paymentSetting': this.payments[this.paymentTypeIndex],
        'userOrder': this.userOrdersKeys[this.orderValue]
      });
      this.clearNewStop();
    }
  }
  // delete stop from flow stop array.
  deleteStop (index) {
    this.flowStopData.splice(index, 1);
  }
  // cancel flow stop changes and get date from backend.
  cancel() {
    this.getFlowStop();
    this.clearNewStop();
  }
  // save local changes of flow stop to backend.
  save () {
    if (this.amountValue && this.paymentTypeValue && this.orderValue) {
      this.flowStopData.unshift({
        'orderAmount': +this.amountValue,
        'paymentSetting': this.payments[this.paymentTypeIndex],
        'userOrder': this.userOrdersKeys[this.orderValue]
      });
      this.clearNewStop();
    } else if ( !this.amountValue && !this.paymentTypeValue && !this.orderValue) {
    } else {
      if (!this.amountValue) {
        this.amountFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.amountFormControl.markAsTouched();
      }
      if (!this.paymentTypeValue) {
        this.paymentTypeFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.paymentTypeFormControl.markAsTouched();
      }
      if (!this.orderValue) {
        this.orderFormControl = new FormControl( '', [
          Validators.required,
        ]);
        this.orderFormControl.markAsTouched();
      }
    }
    this.sendFlowStops();

  }
  // int number validation.
  numberValidation (event, status) {
    if (isNaN(+(this[status] + event.key)) || event.charCode === 32 || isNaN(+event.key)) {
      return false;
    }
  }
  // get search input values.
  getInputValues (status, value) {
    this[status] = value;
    clearTimeout(this.sendGeneralAcceptableStatusTimer);
    this.sendGeneralAcceptableStatusTimer = setTimeout (() => {
      this.sendGeneralAcceptableStatus();
    }, 1000);
  }
  // function in time checkbox click.
  checkboxClick() {
    this.sendGeneralAcceptableStatus();
  }
}
