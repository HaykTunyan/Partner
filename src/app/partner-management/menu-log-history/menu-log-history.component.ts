import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu-log-history',
  templateUrl: './menu-log-history.component.html',
  styleUrls: ['./menu-log-history.component.scss']
})
export class MenuLogHistoryComponent implements OnInit {

  filteredPartnertypes:any
  constructor() {
  }

  ngOnInit() {
  }

  hystorys: any = [
    {
      date: '28 / 9 / 2018',
      time: '12:30',
      name: 'menu name',
      oldValue: 'old value',
      newValue: 'new value'
    },
    {
      date: '28 / 9 / 2018',
      time: '12:30',
      name: 'menu name',
      oldValue: 'old value',
      newValue: 'new value'
    },
    {
      date: '28 / 9 / 2018',
      time: '12:30',
      name: 'menu name',
      oldValue: 'old value',
      newValue: 'new value'
    },
    {
      date: '28 / 9 / 2018',
      time: '12:30',
      name: 'menu name',
      oldValue: 'old value',
      newValue: 'new value'
    },
    {
      date: '28 / 9 / 2018',
      time: '12:30',
      name: 'menu name',
      oldValue: 'old value',
      newValue: 'new value'
    }

  ];

}
