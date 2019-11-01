// Legal Entites Component.
import { Component, OnInit } from '@angular/core';
import { LegalEntityService } from '../../services/legal-entity/legal-entity.service';

@Component({
  selector: 'app-legal-entities',
  templateUrl: './legal-entities.component.html',
  styleUrls: ['./legal-entities.component.scss']
})

// Export Legal Entites Component
export class LegalEntitiesComponent implements OnInit {
  DOMEIN;
  // leaglEntitiListElements
  leaglEntitiListElements = [
    {name: 'Name', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Address', checked: true, sort: {name: 'address', status: ''}},
    {name: 'Bank', checked: true, sort: {name: 'bank', status: ''}},
    {name: 'Bank Number', checked: true, sort: {name: 'bankNumber', status: ''}}
  ];
  sortId = [{
    sort: {
      name: 'id', status: ''
    }
  }];
  newLegalEntiti: any = {
    id: null, name: '', address: '',
    bank: '', bankNumber: '', aktive: false
  };
  emptyLegalEntiti = {
    id: null, name: '', address: '',
    bank: '', bankNumber: '', aktive: false
  };
  nameValue = '';
  selectedAll: any;
  selectedOne: any;
// partners []
  legalEntiti: any = [];
  pageNumber = 0;
  caunt = 20;
  filter = {
    id: '', name: '', address: '',
    bank: '', bankNumber: ''
  };
  sort: any = {
    name: '', status: ''
  };
  nextList = false;
  popup = true;
  filterTiming;
  changeOrCreat = '';
  mouseInsidePopup = false;
  isPopupActive = false;
  mouseInsidePopupDatalist = false;
  isDatalistPopupActive = false;
  filterArray = [];
  partnerFilterText = '';
  error;
  name = false;
  englishNamePlaceholder = false;
  emptyNameField = false;
  repeatName = false;

  IsEdit = true;

  constructor (private legalEntitiService: LegalEntityService) {
    this.DOMEIN = this.legalEntitiService.baseUrl + '/download_legal_entities_list';
  }
  ngOnInit() {
    this.pageNumber = 0;
    this.getLegalEntitiListByPaginationAndFilter();
  }
  inputFocus(border: string) {
    this[border] = true;
  }
  inputFocusOut(border: string, value: string) {
    this[border] = false;
    if (!value) {
      if (border === 'name') {
        this.emptyNameField = true;
      }
    }
  }
  getNameInputValue(value: string, status: string) {
    this.newLegalEntiti[status] = value;
    if (status === 'name') {
      this.emptyNameField = false;
      this.repeatName = false;
    }
  }
  // select all checkbox.
  selectAll() {
    this.legalEntiti.forEach(item => {
      item.checked = this.selectedAll;
    });
  }
  // check all checkbox selected.
  checkIfAllSelected() {
    this.selectedAll = this.legalEntiti.every(item => {
      return item.checked === true;
    });
  }
  // check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.legalEntiti.filter(item => {
      return item.checked === true;
    });
  }
  getLegalEntitiListByPaginationAndFilter() {
    this.legalEntitiService.getLegalEntitiByFilter(this.pageNumber, this.caunt, this.filter, this.sort)
    .subscribe((data: any) => {
      const newLegalEntities = data.content;
      this.pageNumber ?
      this.legalEntiti = this.legalEntiti.concat(newLegalEntities) :
      this.legalEntiti = newLegalEntities;
      if (newLegalEntities[this.caunt - 1]) {
        this.pageNumber++;
        this.nextList = true;
      } else {
        this.nextList = false;
      }
    }, error => {
      console.log(error.status);
    });
  }
  scrollEvent(scroll, elem) {
    if (scroll > elem - window.innerHeight && this.nextList) {
      this.nextList = false;
      this.getLegalEntitiListByPaginationAndFilter();
      }
  }
  typeFilterInput() {
    this.pageNumber = 0;
    this.legalEntiti = [];
    clearTimeout(this.filterTiming);
    this.filterTiming = setTimeout(() => {
      this.getLegalEntitiListByPaginationAndFilter();
    }, 1000);
  }
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }
  sortButton(variable: string, index: number) {
      for (let i = 0; i < this.leaglEntitiListElements.length; i++) {
        if (variable === 'sortId') {
        this.leaglEntitiListElements[i].sort.status = '';
      } else if (i !== index) {
        this.leaglEntitiListElements[i].sort.status = '';
      }
    }
    this[variable][index].sort.status === 'asc' ?
    this[variable][index].sort.status = 'desc' :
    this[variable][index].sort.status = 'asc';
    this.sort = this[variable][index].sort;
  }
  pushOnSaveButton() {
    if (!this.newLegalEntiti.name) {
      this.emptyNameField = true;
      this.repeatName = false;
    } else if (!this.repeatName) {
      if (this.changeOrCreat === 'change') {
        this.ubdateLeaglEntiti();
      } else {
        this.saveNewLegalEntiti();
      }
    }
  }
  saveNewLegalEntiti() {
    this.legalEntitiService.svaeNewLegalEntiti(this.newLegalEntiti).subscribe(data => {
      this.cancelNewSelection();
      this.getLegalEntitiListByPaginationAndFilter();
    }, error => {
      if (error.status === 409) {
        this.repeatName = true;
      }
    });
  }
  fillNewLegalEntiti(legalEntiti = null) {
      this.newLegalEntiti = JSON.parse(JSON.stringify(this.emptyLegalEntiti));
      this.changeOrCreat = 'change';
      legalEntiti ? this.newLegalEntiti = legalEntiti : this.changeOrCreat = 'creat' ;
      this.isPopupActive = true;
  }
  openDatalistPopup(legalEntiti) {
    this.newLegalEntiti = legalEntiti;
    this.legalEntitiService.getPartnersByLegalEntity(legalEntiti.id).subscribe((data: any) => {
      this.filterArray = [];
      if (data.content && Array.isArray(data.content)) {
        for (let i = 0; i < data.content.length; i++) {
          this.filterArray.push(data.content[i].name);
        }
      }
    });
    this.isDatalistPopupActive = true;
  }
  ubdateLeaglEntiti() {
    this.legalEntitiService.ubdateLegalEntiti(this.newLegalEntiti).subscribe(data => {
      this.cancelNewSelection();
      this. getLegalEntitiListByPaginationAndFilter();
    }, error => {

    });
  }
  cancelNewSelection() {
    this.isPopupActive = false;
    this.emptyNameField = false;
    this.repeatName = false;
    this.name = false;
  }
  canceDatalistPopupActive () {
    this.isDatalistPopupActive = false;
  }

  // popup functions
  clickOutsidePopup(status1, status2) {
    if (!this[status1]) {
      this[status2]();
    }
  }
  dontClosePopup(status) {
    this[status] = true;
  }
   closePopup(status) {
    this[status] = false;
  }
  activateNewOrChangeableSelection() {
    this.newLegalEntiti.active = !this.newLegalEntiti.active;
  }
}
