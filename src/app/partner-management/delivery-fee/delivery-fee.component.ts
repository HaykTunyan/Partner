// Delivery Fee Component

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'delivery-fee',
  templateUrl: './delivery-fee.component.html',
  styleUrls: ['./delivery-fee.component.scss']
})

// Export Delivery Fee Component
export class DeliveryFeeComponent implements OnInit {

  showlist = true;
  value = '400';
  freeOrderValue = '300';
  minValue = '500';
  maxValue = '120';
  selected = 1;
  areaList: string[] = [
    'Charbakh', 
    'Kanaker-Zeytun', 
    'Avan-Arinj', 
    'Nor-Norq', 
    'Arabkir', 
    'Kentron', 
    'Erebuni', 
    'Shengavit', 
    'Davitashen'
  ];

  menusName = ' Delivery Fee '
  showdeliveryMM = true;
  showdeliveryPM = true;
  showdeliveryMP = true;
  showdistanceMM = false;
  showdistancePM = false;
  showdistanceMP = false;
  showFirstGroup = true;
  showSecondGroup = true;
  checkedMM = true;
  checkedPM = true;
  checkedMP = true;
  checkedPerDistanseMM = false;
  checkedPerDistansePM = false;
  checkedPerDistanseMP = false;
  checkedZona = true;
  checkedDistance = false;

// showPayDayMM

showPayDayMM = false;
showPayDayMP = false;
showPayDayPM = false;

  constructor() { }
  showtext;

  ngOnInit() {}

  // delete completed field
  deleteCompletedField() {
    this.value = '';
    this.minValue = '';
    this.maxValue = '';
    this.freeOrderValue = '';
  }

  // pass change Fix Rate MM
  onChangeFixRateMM(event) {
    this.checkedMM = event && event.checked;
    this.checkedPerDistanseMM = !this.checkedMM;
  }

  // pass change Fix Rate PM
  onChangeFixRatePM(event) {
    this.checkedPM = event && event.checked;
    this.checkedPerDistansePM = !this.checkedPM;
  }

  // pass change Fix Rate MP
  onChangeFixRateMP(event) {
    this.checkedMP = event && event.checked;
    this.checkedPerDistanseMP = !this.checkedMP;
  }

  // pass change Per Distanse MM
  onChangePerDistanseMM(event) {
    this.checkedPerDistanseMM = event && event.checked;
    this.checkedMM = !this.checkedPerDistanseMM;
  }

  // pass change Per Distanse PM
  onChangePerDistansePM(event) {
    this.checkedPerDistansePM = event && event.checked;
    this.checkedPM = !this.checkedPerDistansePM;
  }
  
  // pass change Per Distanse MP
  onChangePerDistanseMP(event) {
    this.checkedPerDistanseMP = event && event.checked;
    this.checkedMP = !this.checkedPerDistanseMP;
  }

  // change Per Zona to Per Distance
  onChangeZona(event) {
    this.checkedZona = event && event.checked;
    this.checkedDistance = !this.checkedZona;
  }

  onChangeDistance(event) {
    this.checkedDistance = event && event.checked;
    this.checkedZona = !this.checkedDistance;
  }


  // Key Event
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }

}
