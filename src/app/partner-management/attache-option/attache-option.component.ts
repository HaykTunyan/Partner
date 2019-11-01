import {Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-attache-option',
  templateUrl: './attache-option.component.html',
  styleUrls: ['./attache-option.component.scss']
})
export class AttacheOptionComponent implements OnInit {

  @Input() showAddOptionPage: boolean;

  attachs = [
    {
      name: 'Sauce1',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: true
    },
    {
      name: 'Sauce2',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: false
    },
    {
      name: 'Sauce3',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: false
    },
    {
      name: 'Sauce4',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: true
    },
    {
      name: 'Sauce5',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: false
    },
    {
      name: 'Sauce1',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: true
    },
    {
      name: 'Sauce2',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: false
    },
    {
      name: 'Sauce3',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: false
    },
    {
      name: 'Sauce4',
      options: [{
        name: 'Garlic sauce 1',
        price: '200 AMD'
      },
        {
          name: 'Garlic sauce 2',
          price: '200 AMD'
        },
        {
          name: 'Garlic sauce 3',
          price: '200 AMD'
        },
      ],
      checked: true
    }
  ];

  showAddEditOption = false;
  showAttacheOption = true;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    console.log(this.showAddOptionPage);
  }

  showAddEditOptionFunc() {
    this.showAddEditOption = true;
    this.showAttacheOption = false;
  }

  closeAddEditOptionFunc() {
    this.showAddEditOption = false;
    this.showAttacheOption = true;
  }

  changeClosePopup = true;

  // forbid to close any popup
  dontClosePopup() {
    this.changeClosePopup = false;
  }

  // allow to close popup
  closePopup() {
    this.changeClosePopup = true;
  }


  //============================================= ADD ATTACHE OPTION ========================

  addOption = {
    showOptName: true,
    nameEng: '',
    nameRus: '',
    nameArm: '',
    multipleChoice: true,
    price: true,
    quantityLimit: 1,
    maxNumOfSelection: '',
    minNumOfSelection: '',
    disableNow: true,
    choices: [],
    optNameErr: ''
  };

  choice = {
    nameEng: '',
    nameRus: '',
    nameArm: '',
    choice: ['choice 1', 'choice 1', 'choice 1', 'choice 1'],
    selectedChoice: '',
    price: '',
    checkedByDefault: false,
    disableNow: true,
    selectDescriptionArm: false,
    selectDescriptionRus: false,
    selectDescriptionEng: true,
    descriptionEng: '',
    descriptionRus: '',
    descriptionArm: '',
    choiceNameErr: '',
    subChoice: {
      nameEng: '',
      nameRus: '',
      nameArm: '',
      choice: ['choice 1', 'choice 1', 'choice 1', 'choice 1'],
      selectedChoice: '',
      price: '',
      checkedByDefault: false,
      disableNow: true,
      show: false,
      descriptionEng: '',
      descriptionRus: '',
      descriptionArm: '',
      selectDescriptionArm: false,
      selectDescriptionRus: false,
      selectDescriptionEng: true,
      subChoiceNameErr: ''
    }
  };

  showOptNameOrNot() {
    this.addOption.showOptName ?
      this.addOption.showOptName = false :
      this.addOption.showOptName = true;
  }

  choiceCheckedByDefaultOrNot(ind) {
    this.addOption.choices[ind].checkedByDefault ?
      this.addOption.choices[ind].checkedByDefault = false :
      this.addOption.choices[ind].checkedByDefault = true;
  }

  subChoiceCheckedByDefaultOrNot(ind) {
    this.addOption.choices[ind].subChoice.checkedByDefault ?
      this.addOption.choices[ind].subChoice.checkedByDefault = false :
      this.addOption.choices[ind].subChoice.checkedByDefault = true;
  }

  subChoiceDisableOrNotFunc(ind) {
    this.addOption.choices[ind].subChoice.disableNow ?
      this.addOption.choices[ind].subChoice.disableNow = false :
      this.addOption.choices[ind].subChoice.disableNow = true;
  }

  choiceDisableOrNotFunc(ind) {
    this.addOption.choices[ind].disableNow ?
      this.addOption.choices[ind].disableNow = false :
      this.addOption.choices[ind].disableNow = true;
  }

  disableOrNotFunc() {
    this.addOption.disableNow ?
      this.addOption.disableNow = false :
      this.addOption.disableNow = true;
  }

  multipleChoiceOrNotFunc() {
    this.addOption.multipleChoice ?
      this.addOption.multipleChoice = false :
      this.addOption.multipleChoice = true;
  }

  priceTrueOrFalseFunc() {
    this.addOption.price ?
      this.addOption.price = false :
      this.addOption.price = true;
  }

  selectDescriptionEng = true;
  selectDescriptionRus = false;
  selectDescriptionArm = false;


  // Key Event
  numberValidation(event) {
    if (isNaN(event.key) || event.charCode === 32) {
      return false;
    }
  }

  showSubChoicesFunc(ind) {
    this.addOption.choices[ind].subChoice.show = true;
  }

  deleteSubChoiceFunc(ind) {
    this.addOption.choices[ind].subChoice.show = false;
  }


  tmp = 0;
  deleteTrue = false;
  showChoices = false;

  showChoicesFunc() {
    this.showChoices ? this.showChoices = false : this.showChoices = true;
  }

  deleteChoice(ind) {
    this.addOption.choices.splice(ind, 1);
    // this.addOption.choices[ind].subChoice.show = false;
    this.addOption.quantityLimit--;
    if (+(this.addOption.quantityLimit) === 0) {
      this.showChoices = false;
    }
    this.deleteTrue = true;
    this.tmp = +(this.addOption.quantityLimit);
    // console.log(this.addOption, 'delete choice');
  }

  changeChoicesCount() {
    if (+(this.addOption.quantityLimit) === 0) {
      this.addOption.choices.splice(0);
      this.showChoices = false;
    } else if (this.tmp < +(this.addOption.quantityLimit)) {
      for (let i = 0; i < this.addOption.quantityLimit - this.tmp; ++i) {
        this.choice = JSON.parse(JSON.stringify(this.choice));
        this.addOption.choices.push(this.choice);
      }
      // console.log(this.addOption, 'choices------push');
    } else if (this.tmp > +(this.addOption.quantityLimit)) {
      for (let i = 0; i < this.tmp - this.addOption.quantityLimit; ++i) {
        this.addOption.choices.pop();
      }
      // console.log(this.addOption, 'choices------pop');
    }
    this.tmp = +(this.addOption.quantityLimit);
  }

  changedChoiceText(text, ind) {
    if (this.addOption.choices[ind].selectDescriptionEng) {
      // console.log('eng');
      this.addOption.choices[ind].descriptionEng = text;
      this.addOption.choices[ind].descriptionRus = '';
      this.addOption.choices[ind].descriptionArm = '';
    } else if (this.addOption.choices[ind].selectDescriptionRus) {
      // console.log('rus');
      this.addOption.choices[ind].descriptionRus = text;
      this.addOption.choices[ind].descriptionArm = '';
      this.addOption.choices[ind].descriptionEng = '';
    } else if (this.addOption.choices[ind].selectDescriptionArm) {
      // console.log('arm');
      this.addOption.choices[ind].descriptionArm = text;
      this.addOption.choices[ind].descriptionRus = '';
      this.addOption.choices[ind].descriptionEng = '';
    }
    // console.log(this.addOption.choices);
  }

  changeOptName() {
    if (this.addOption.nameEng.trim() || this.addOption.nameRus.trim() || this.addOption.nameArm.trim()) {
      this.addOption.optNameErr = '';
    }
  }

  changeChoiceName(ind) {
    if (this.addOption.choices[ind].nameEng.trim() || this.addOption.choices[ind].nameRus.trim() || this.addOption.choices[ind].nameArm.trim()) {
      this.addOption.choices[ind].choiceNameErr = '';
    }
  }

  changeSubChoiceName(ind) {
    if (this.addOption.choices[ind].subChoice.nameEng.trim() || this.addOption.choices[ind].subChoice.nameRus.trim() || this.addOption.choices[ind].subChoice.nameArm.trim()) {
      this.addOption.choices[ind].subChoice.subChoiceNameErr = '';
    }
  }

  selectionErr1 = '';
  selectionErr2 = '';

  @ViewChild('optName') optname: ElementRef;
  @ViewChildren('choices') choices: QueryList<any>;


  save() {
    if (!(this.addOption.nameEng.trim() || this.addOption.nameRus.trim() || this.addOption.nameArm.trim())) {
      this.addOption.optNameErr = 'At least one language is required';
      this.optname.nativeElement.scrollIntoView({behavior: 'smooth'});
      return;
    }

    if (this.addOption.maxNumOfSelection || this.addOption.minNumOfSelection) {
      if (+(this.addOption.maxNumOfSelection) > +(this.addOption.quantityLimit)) {
        this.selectionErr1 = 'Max number of selections must be equal or less than number of choices';
        this.optname.nativeElement.scrollIntoView({behavior: 'smooth'});
        return;
      }

      if (+(this.addOption.maxNumOfSelection) <= +(this.addOption.minNumOfSelection)) {
        this.selectionErr1 = 'Max number of selections must be bigger than min number of selections';
        this.optname.nativeElement.scrollIntoView({behavior: 'smooth'});
        return;
      }
    }

    for (let ind = 0; ind < this.addOption.choices.length; ++ind) {
      if (this.showChoices) {
        if (!(this.addOption.choices[ind].nameEng.trim() || this.addOption.choices[ind].nameRus.trim() || this.addOption.choices[ind].nameArm.trim())) {
          this.addOption.choices[ind].choiceNameErr = 'At least one language is required';
          this.choices['_results'][ind].nativeElement.children[0].scrollIntoView({behavior: 'smooth'});
          ind = Infinity;
          return;
        }
      }
      if (this.addOption.choices[ind].subChoice.show) {
        if (!(this.addOption.choices[ind].subChoice.nameEng.trim() || this.addOption.choices[ind].subChoice.nameRus.trim() || this.addOption.choices[ind].subChoice.nameArm.trim())) {
          this.addOption.choices[ind].subChoice.subChoiceNameErr = 'At least one language is required';
          this.choices['_results'][ind].nativeElement.children[2].scrollIntoView({behavior: 'smooth'});
          ind = Infinity;
          return;
        }
      }
    }

    console.log('Saved object: ', this.addOption);
  }

}
