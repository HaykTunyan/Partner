import { Component, OnInit, ViewChild } from '@angular/core';
import { SectionListService } from '../../services/section-list/section-list.service';
import { FilesService } from '../../services/files/files.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})

// Export Section List Component
export class SectionListComponent implements OnInit {
  @ViewChild('allContent') allContent;
  categoryFormControl = new FormControl('', [
    Validators.required
  ]);
  isPopupActive = false;
  mouseInsidePopup = false;
  selectedAll: any;
  selectedOne: any;
  isCategoryFilterSelectOptionOpen = false;
  isCategoryPopupSelectOptionOpen = false;
  categories: any = [];
  // sections []
  sections: any;
  // partnerListElements
  partnerListElements = [
    {name: 'Service Name', checked: true, sort: {name: 'engName', status: ''}},
    {name: 'Section Category', checked: true, sort: {name: 'category.name', status: ''}}
  ];
  sortId = [{name: 'id', checked: true, sort: {name: 'id', status: ''}}];
  filter = {
    id: '',
    name: '',
    category: ''
  };
  categoryFilterInputValue = '';
  englishName = false;
  englishNamePlaceholder = false;
  russianName = false;
  russianNamePlaceholder = false;
  armenianName = false;
  armenianNamePlaceholder = false;
  IsEdit = true;
  pageNumber = 0;
  pageCount = 20;
  sort;
  nexPage = true;
  newSection: any = {
    id: null,
    isDisable: true,
    category: {
      id: ''
    },
    items: [''],
    name: '',
    arm: '',
    ru: ''
  };
  emptySection = {
    id: null,
    isDisable: true,
    category: {
      id: ''
    },
    items: [''],
    arm: '',
    name: '',
    ru: ''
  };
  categoryPopupInputValue = '';
  image;
  emptyNameField = false;
  repeatName = false;
  imageInput = '';
  startFilter;
  popupStatus = 'create';
  serverError = false;

  constructor(
    private sLService: SectionListService,
    private filesService: FilesService) {
  }

  ngOnInit() {
    this.englishNamePlaceholder = !!this.newSection.name;
    this.russianNamePlaceholder = !!this.newSection.ru;
    this.armenianNamePlaceholder = !!this.newSection.arm;
    this.pageNumber = 0;
    this.getCategories();
    this.getByFilterAndSortSections();
  }

  getByFilterAndSortSections() {
    this.sLService.getByFilter(this.pageNumber, this.pageCount, this.filter, this.sort).subscribe((data: any) => {
      const newData = data.content;
      this.pageNumber ?  this.sections = this.sections.concat(newData) : this.sections = newData;
      if (newData[this.pageCount - 1]) {
        this.pageNumber++;
        this.nexPage = true;
      } else {
        this.nexPage = false;
      }
    }, error => {
      console.log(error.status);
    });
  }
  createSectionBackendFormat (newSection) {
    const bodey: any = JSON.parse(JSON.stringify(newSection));
    const translationArray = [];
    bodey.arm ? translationArray.push({
        language: {
          code: 'arm'
        },
        translate: bodey.arm
    }) : '';
    bodey.ru ? translationArray.push({
      language: {
        code: 'ru'
      },
      translate: bodey.ru
    }) : '';
    bodey.menuSectionLangDtoList = translationArray;
    delete bodey.arm;
    delete bodey.ru;
    return bodey;
  }

  saveSection() {
    const bodey: any = this.createSectionBackendFormat(this.newSection);
    this.sLService.saveSection(bodey).subscribe(data => {
      this.pageNumber = 0;
      this.cancelNewSelection();
      this.getByFilterAndSortSections();
      this.serverError = false;
    }, error => {
      if (error.status === 409) {
        this.repeatName = true;
      }
      console.log(error.status);
      this.serverError = true;
    });
  }

  changeSectionToBackend() {
    const bodey: any = this.createSectionBackendFormat(this.newSection);
    this.sLService.changeSection(bodey).subscribe(data => {
      this.pageNumber = 0;
      this.cancelNewSelection();
      this.getByFilterAndSortSections();
      this.serverError = false;
    }, error => {
      if (error.status === 409) {
        this.repeatName = true;
        this.serverError = false;
      }
      console.log(error.status);
      this.serverError = true;
    });
  }

  typeInFilterInput() {
    this.sections = [];
    this.pageNumber = 0;
    clearTimeout(this.startFilter);
    this.startFilter = setTimeout(() => {
      this.getByFilterAndSortSections();
    }, 1000);
  }

// select all checkbox
  selectAll() {
    this.sections.forEach(item => {
      item.checked = this.selectedAll;
    });
  }

  getCategories() {
    this.sLService.getCategory().subscribe(data => {
      this.categories = data;
    });
  }

  // close filter category list popup.
  closeCreatCategory(variable) {
    this[variable] = false;
    this.categoryFormControl.markAsTouched();
  }

  // get role from option in create popup and filter.
  selectCategoryCreate(category, index, variable) {
    this[variable] = false;
    if (variable === 'isCategoryFilterSelectOptionOpen') {
      this.categoryFilterInputValue = category;
      this.filter.category = category;
      this.pageNumber = 0;
      this.getByFilterAndSortSections();
    } else {
      this.newSection.category.id = this.categories[index].id;
      this.categoryFormControl = new FormControl(category, [
        Validators.required
      ]);
      this.categoryPopupInputValue = category;
    }

  }

  // open category popup list
  openCategorySelectOption(variable) {
    this[variable] = true;
  }

  // function, which doesn't allow to input anything
  keyDownCategoryInput(event, variable) {
    if (event.keyCode === 8) {
      if (variable === 'categoryFilterInputValue') {
        if (this.categoryFilterInputValue) {
          this.pageNumber = 0;
          this.filter.category = '';
          this[variable] = '';
          this.getByFilterAndSortSections();
        }
      } else {
        this.newSection.category = [];
        this[variable] = new FormControl('', [
          Validators.required
        ]);
      }
    } else {
      return false;
    }
  }

  clearCategoryInput() {
    this.categoryPopupInputValue = '';
    this.newSection.category.id = '';
  }

  // check all checkbox selected
  checkIfAllSelected() {
    this.selectedAll = this.sections.every(item => {
      return item.checked === true;
    });
  }

  // check at list one checkbox selected
  checkIfOneSelected() {
    this.selectedOne = this.sections.filter(item => {
      return item.checked === true;
    });
  }

  openCreateSection() {
    this.popupStatus = 'create';
    this.isPopupActive = true;
    this.categoryFormControl = new FormControl('', [
      Validators.required
    ]);
  }

  sortButton(variable, index) {
    if (variable === 'sortId') {
      this.partnerListElements[0].sort.status = '';
      this.partnerListElements[1].sort.status = '';
    } else {
      this.sortId[0].sort.status = '';
      let ind;
      index ? ind = 0 : ind = 1;
      this.partnerListElements[ind].sort.status = '';
    }
    if (this[variable][index].sort.status === 'asc') {
      this[variable][index].sort.status = 'desc';
    } else {
      this[variable][index].sort.status = 'asc';
    }
    this.sort =  this[variable][index].sort;
    this.getByFilterAndSortSections();
  }

  scrollEvent(elem: number) {
    const height = this.allContent.nativeElement.clientHeight;
    if (elem >= height - window.innerHeight && this.nexPage) {
      this.getByFilterAndSortSections();
      this.nexPage = false;
    }
  }

  // popup functions
  clickOutsidePopup() {
    if (!this.mouseInsidePopup) {
      this.cancelNewSelection();
    }
  }

  dontClosePopup() {
    this.mouseInsidePopup = true;
  }

  closePopup() {
    this.mouseInsidePopup = false;
  }

  activateNewOrChangeableSelection() {
    this.newSection.isDisable = !this.newSection.isDisable;
  }

  cancelNewSelection() {
    this.isPopupActive = false;
    this.mouseInsidePopup = false;
    this.emptyNameField = false;
    this.repeatName = false;
    this.englishNamePlaceholder = false;
    this.russianNamePlaceholder = false;
    this.armenianNamePlaceholder = false;
    this.categoryPopupInputValue = '';
    this.imageInput = '';
    this.categoryFormControl = new FormControl('', [
      Validators.required
    ]);
    this.newSection = new Object(this.emptySection);
  }

  getNewSelectionData() {
    if (this.newSection.name && this.newSection.category.id) {
      if (this.popupStatus === 'create') {
        this.saveSection();
      } else if (this.popupStatus === 'change' ) {
        this.changeSectionToBackend();
      }
    } else {
      !this.newSection.name ? this.emptyNameField = true: '';
      !this.newSection.category.id ? this.categoryFormControl.markAsTouched(): '';
    }
  }

  inputFocus(border: string, placeholder: string) {
    this[border] = true;
    this[placeholder] = true;
  }

  inputFocusOut(border: string, placeholder: string, value: string) {
    this[border] = false;
    if (!value) {
      this[placeholder] = false;
      if (border === 'englishName') {
        this.emptyNameField = true;
      }
    }
  }
  getNameInputValue(value: string, status: string) {
    this.newSection[status] = value;
    if (status === 'name') {
      this.emptyNameField = false;
      this.repeatName = false;
    }
  }

  uploadImage(event) {
    this.image = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', this.image, this.image.name);
    this.filesService.saveFile(uploadData, 'IMAGE').subscribe(res => {
      const url = res;
      this.newSection.items[0] = res;
      this.imageInput = '';
    }, error => {
      this.imageInput = '';
    });
  }

  deleteImage() {
    this.newSection.items[0] = '';
    this.imageInput = '';
  }

  deleteSection(id) {
    this.sLService.deleteSection(id).subscribe(data => {
      this.pageNumber = 0;
      this.getByFilterAndSortSections();
    });
  }

  changeSection(section) {
    this.isPopupActive = true;
    this.popupStatus = 'change';
    const changeableSection: any = JSON.parse(JSON.stringify(section));
    for (let i = 0; i < changeableSection.menuSectionLangDtoList.length; i++) {
      changeableSection[changeableSection.menuSectionLangDtoList[i].language.code] =
      changeableSection.menuSectionLangDtoList[i].translate;
    }
    this.newSection = changeableSection;
    if (!this.newSection.arm) {
      this.newSection.arm = '';
    }
    if (!this.newSection.ru) {
      this.newSection.ru = '';
    }
    console.log(section);
    this.englishNamePlaceholder = !!this.newSection.name;
    this.russianNamePlaceholder = !!this.newSection.ru;
    this.armenianNamePlaceholder = !!this.newSection.arm;
    this.categoryFormControl = new FormControl(section.category.name, [
      Validators.required
    ]);

  }
  clearNameInputs() {
    this.newSection.name = '';
    this.newSection.ru = '';
    this.newSection.arm = '';
    this.englishNamePlaceholder = false;
    this.russianNamePlaceholder = false;
    this.armenianNamePlaceholder = false;
    this.serverError = false;
  }
}
