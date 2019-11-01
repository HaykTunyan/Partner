// Header Admin Component

import { Component, OnInit } from '@angular/core';

// Component
@Component({
  selector: 'header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})

// export Header Admin Component
export class HeaderAdminComponent implements OnInit {


// title navbar 


admin = " John Petrosyan "
country = " Georgia "

  constructor() { }

  ngOnInit() {
  }

}
