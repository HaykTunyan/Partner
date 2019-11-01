// Log Hystory Component

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'log-hystory',
  templateUrl: './log-hystory.component.html',
  styleUrls: ['./log-hystory.component.scss']
})

// export Log Hystory Component
export class LogHystoryComponent implements OnInit {

  showlist = true;

  // Log Hystorys string  
  hystorys: any = [
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg',              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Arevshat ',           description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Shaterkaranun',       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorgyan',           description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Arzumanyan',          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Shaterkarazganunyan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
    {date: '28 / 9 / 2018', time: '12:30', name: 'Gevorg Gevorgyan',    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua amet,'},
  ];

  logElements = ['Date', 'Time', 'Changer Name', 'Description'];

  TypeControl = new FormControl();
  partnertypes: string[] = ['Yerevan', 'Yerevan', 'Yerevan'];
  filteredPartnertypes: Observable<string[]>;
  
  constructor () {}
  showtext;

ngOnInit () {
  // aoutocomplete filter partnertype option
  this.filteredPartnertypes = this.TypeControl.valueChanges
  .pipe (
    startWith(''),
    map(value => this._filter(value))
  );
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();
  return this.partnertypes.filter(partnertype => partnertype.toLowerCase().includes(filterValue));
} 
}
