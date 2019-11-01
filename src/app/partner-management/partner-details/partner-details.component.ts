// Partner Details Component.

import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PartnersService } from '../../services/partners/partners.service';


// Keyword
export interface Keyword {
  name: string;
}

@Component({
  selector: 'partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss']
})

// Export Partner Details Component
export class PartnerDetailsComponent implements OnInit {

  constructor (private partnersService: PartnersService) {}
  
  Phonenumber = " Phone number ";
  
  Contacttype = " Contact type ";
  
  Orderreleted = " Order releted ";
  
  Forwhat = " For what ";
  
  // map angular 
  
  title: string = 'GPS Coordinates (link to online map)';
  lat: number = 51.678418;
  lng: number = 7.809007;
  
  value = 'Clear me';
  
  // Card Fiwe
  
  name = 'Name';
  
  brandoption = '';
  
  // Table header
  showlist = true;
  
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
  partnerId;
  partner;
  keywordArray = [];
  keywords;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  // keyword
  // keywords: Keyword[] = [
  //   {name: 'Pizza'},
  // ];
  
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
  menusName = "Menu";
  
  // aoutocoplete 
  
  BrandControl = new FormControl();
  brandoptions: string[] = ['One', 'Two', 'Three'];
  filteredBrandOptions: Observable<string[]>;
  
  ngOnInit() {
    this.partnersService.currentId.subscribe(id => this.partnerId = id);

    if (this.partnerId) {
      this.partnersService.getPartnerById(this.partnerId).subscribe(response => {
        if (response) {
          this.partner = response;
          this.keywords = this.partner.keywords.forEach(item => {
            this.keywordArray.push(item.name)
            console.log(this.keywordArray)
          })
          console.log(this.partner)
        }
      });
    }
    this.filteredBrandOptions = this.BrandControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
  
    return this.brandoptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}

