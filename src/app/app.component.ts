// App Component 

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template : 
  `
  <div>
    <!-- router outlet -->
    <router-outlet></router-outlet>
  </div>

  `,
  styleUrls: ['./app.component.scss']
})

//export AppComponent 
export class AppComponent {
  
constructor() {}

}
