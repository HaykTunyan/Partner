// User Management Component

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserManagementService} from '../services/user-management/user-management.service';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})

export class UserManagementComponent implements OnInit {
  DOMEIN;
  users: any;
  selectedOne: any;
  resetPasswordPopup = false;
  // userListElements
  userListElements = [
    {name: 'Full Name', checked: true, sort: {name: 'name', status: ''}},
    {name: 'Email Address', checked: true, sort: {name: 'email', status: ''}},
    {name: 'Reg Date', checked: true, sort: {name: 'createDate', status: ''}},
    {name: 'Phone Number', checked: true, sort: {name: 'phone', status: ''}},
    {name: 'Roles', checked: true, sort: {name: 'roleSet.role.role', status: ''}},
  ];
  arrayBorderRadius = [false, false, false, false, true]
  isRoleFilterSelectOptionOpen = false;
  roleFilterInputValue = '';
  // object for clear editable user.
  emptyUser = {
    'name': '',
    'id': 0,
    'active': true,
    'phoneNumber': '',
    'email': '',
    'createDate': '',
    'hasPassword': true,
    'roleDtos': [{
      'roleId': 0,
      'name': '',
      'action': 'VIEW',
    }]
  };
  editableUserIndex = null;
  createOrChangeStatus: string;
  isUserPopupActive = false;
  isDeletePopupActive = false;
  rolesArray: any;
  createRolesArray: any;
  // role colors.
  roleColors = {
    'Partner Management': '#367B52',
    'Customer Support': '#2B7591',
    'Couriers Dispatch Management': '#7B7636',
    'Logistics Management': '#7B366D',
    'Campaign Management': '#E75913',
    'Financial': '#A6481C',
    'Reporting': '#A1BA42',
    'User Management': '#8C5638',
    'Flow Management': '#642D19',
    'Zone Constructor': '#143656',
    'Settings': '#F63F6B',
    'CMS': '#5AC116',
    'Company Management': '#1EA2D4',
    'Inventory Management': '#55CECE'
  };
  // selectable rol in create new user or changeable user.
  selectedRole = {
    'roleId': 0,
    'name': '',
    'action': 'VIEW'
  };
  rolesCreateSelect = false;
  mailInputValidation = true;
  popupSubmitDisabled = false;
  chaneClosePopup = true;
  selectedRoleId = 'No id';
  selectedAction = 'VIEW';
  isRoleSelected = true;
  isFilterStart = false;
  filterTimer;
  // new user data object.
  changeableUser = {
    'name': '',
    'id': 0,
    'active': true,
    'phoneNumber': '',
    'email': '',
    'createDate': '',
    'hasPassword': true,
    'roleDtos': [{
      'roleId': 0,
      'name': '',
      'action': 'VIEW',
    }]
  };
  // filter inputs values.
  filter = {
    'name': '',
    'email': '',
    'phoneNumber': '',
    'role': '',
    'date': ''
  };
  // variable for sort kind.
  sortBy;
  invitationOrResend = 'false';
  // users data from back end.
  data: any;
  @ViewChild('content') content: ElementRef;
  contentHeight;
  getNewUsers = true;
  paginationCount = 0;
  serverError = false;
  errorMassage = '';
  noServer = false;
  // filter date clear variable.
  date = new FormControl(null);
  IsEdit = false;

  constructor(private userManagement: UserManagementService, private router: Router) {
    this.DOMEIN = userManagement.baseUrl + '/download_users_list';
  }

  ngOnInit() {
    this.IsEdit = this.decideUserStatus();
    // get roles from beck end.
    this.userManagement.getRolesArray().subscribe((roles) => {
      this.rolesArray = roles;
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
    this.getUserList();
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
            if (menuUser.userDto.roleDtos[i].name === 'User Management') {
              if (menuUser.userDto.roleDtos[i].action === 'EDIT') {
                i = Infinity;
                return true;
              } else if (menuUser.userDto.roleDtos[i].action === 'VIEW') {
                i = Infinity;
                return false;
              }
            }
          }  this.logout();
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
  downloadExel() {
    this.userManagement.downloadUserList().subscribe(data => {
    });
  }
  // get 20 users from beck end.
  getUserList(page = 0, count = 20) {
    if (this.isFilterStart) {
      this.userManagement.getByFilter(this.filter, page, count, this.sortBy).subscribe((data) => {
        if (data) {
          this.data = data;
          if (page === 0) {
            this.users = this.data.content;
          } else {
            const concatArray = this.data.content;
            this.users = this.users.concat(concatArray);
          }
          this.getNewUsers = !!this.data.content[19];
        }
        this.noServer = false;
      }, error => {
         if (error.status === 401 || error.status === 403) {
           this.logout();
         }
        this.noServer = true;
      });
    } else {
      this.userManagement.getUsersByPagination(page, count).subscribe((data) => {
        if (data) {
          if (page === 0) {
            this.users = data;
          } else {
            const concatArray = data;
            this.users = this.users.concat(concatArray);
          }
          this.getNewUsers = !!data[19];
        }
      }, error => {
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      });
    }
    this.paginationCount++;
  }

  // function for create sort params and send back end.
  sortButton(index) {
    if (!this.userListElements[index].sort.status) {
      this.userListElements[index].sort.status = 'asc';
    } else if (this.userListElements[index].sort.status === 'asc') {
      this.userListElements[index].sort.status = 'desc';
    } else {
      this.userListElements[index].sort.status = 'asc';
    }
    for (let i = 0; i < this.userListElements.length; i++) {
      if (i !== index) {
        this.userListElements[i].sort.status = '';
      }
    }
    this.isFilterStart = true;
    this.sortBy = this.userListElements[index].sort;
    this.paginationCount = 0;
    this.getUserList();
  }

  // open roles popup list
  openRoleSelectOption(status) {
    if (status === 'create') {
      this.rolesCreateSelect = true;
    } else if (status === 'filter') {
      this.isRoleFilterSelectOptionOpen = true;
    }
  }

  // close filter roles list popup.
  closeCreatRoles(status) {
    status === 'filter' ?
      this.isRoleFilterSelectOptionOpen = false :
      this.rolesCreateSelect = false;
  }

  // get rol index for set rol name or another params.
  getRoleIndex(role) {
    for (let i = 0; i < this.rolesArray.length; i++) {
      if (role.roleId === this.rolesArray[i].roleId) {
        return '' + i;
      }
    }
  }

  // get role from option in create popup and filter.
  selectRoleCreate(role, status, index) {
    if (status === 'filter') {
      this.filter.role = index;
      this.roleFilterInputValue = role.role;
      this.isRoleFilterSelectOptionOpen = false;
      this.writeInFilterInputs('role', role.role);
    } else if (status === 'create') {
      this.rolesCreateSelect = false;
      this.selectedRoleId = this.getRoleIndex(role);
      this.isRoleSelected = true;
      this.selectedRole.roleId = +role.roleId;
      this.selectedRole.name = role.role;
      this.selectedRole.action = this.selectedAction;
      this.createCreateRolesArray();
    }
  }

  // change role status view or edit and view
  setRoleAction(id) {
    this.selectedAction = id;
    this.selectedRole.action = id;
  }

  // open create user popup
  createUser() {
    this.popupSubmitDisabled = false;
    this.isUserPopupActive = true;
    this.createOrChangeStatus = 'create';
    this.createRolesArray = JSON.parse(JSON.stringify(this.rolesArray));
  }

  // delete role in popup
  closeAndDeleteRole(index) {
    this.changeableUser.roleDtos.splice(index, 1);
    this.createCreateRolesArray();
  }

  // create or change user in server
  getNewUserData() {
    let clearUser;
    if (this.changeableUser.email) {
      if (this.mailInputValidation) {
        const user = this.changeableUser;
        if (this.createOrChangeStatus === 'create') {
          delete user['createDate'];
          if (user.roleDtos[0].roleId === 0) {
            user.roleDtos.shift();
          }
          if (this.selectedRole.roleId) {
            user.roleDtos.push(this.selectedRole);
          }
          this.userManagement.createUser(user).subscribe((data) => {
            this.isUserPopupActive = false;
            this.mailInputValidation = true;
            this.popupSubmitDisabled = true;
            this.serverError = false;
            this.paginationCount = 0;
            this.selectedRole.roleId = 0;
            this.selectedRoleId = 'No id';
            this.selectedRole.name = '';
            this.selectedRole.action = 'VIEW';
            clearUser = JSON.stringify(this.emptyUser);
            this.changeableUser = JSON.parse(clearUser);
            this.getUserList();
          }, (error) => {
            if (error.status === 400) {
              this.mailInputValidation = false;
              this.serverError = true;
              this.popupSubmitDisabled = false;
              this.errorMassage = 'Email address is not valid';
            } else if (error.status === 409) {
              this.mailInputValidation = false;
              this.popupSubmitDisabled = false;
              this.serverError = true;
              this.errorMassage = 'The user with this email already exists.';
            } else if (error.status === 401  || error.status === 403) {
              this.logout();
            } else {
              this.serverError = true;
              this.mailInputValidation = true;
              this.popupSubmitDisabled = true;
              this.errorMassage = ' Something went wrong.';
            }
            console.log(error);
          });
        } else if (this.createOrChangeStatus === 'edit') {
          if (this.selectedRole.roleId) {
            user.roleDtos.push(this.selectedRole);
          }
          this.userManagement.changeUser(user).subscribe((data) => {
            this.mailInputValidation = true;
            this.popupSubmitDisabled = true;
            this.isUserPopupActive = false;
            this.serverError = false;
            this.selectedRole.roleId = 0;
            this.selectedRole.name = '';
            this.selectedRoleId = 'no Id';
            this.selectedRole.action = 'VIEW';
            clearUser = JSON.stringify(this.emptyUser);
            this.changeableUser = JSON.parse(clearUser);
          }, (error) => {
            console.log(error);
            if (error.status === 400) {
              this.mailInputValidation = false;
              this.popupSubmitDisabled = false;
              this.serverError = true;
              this.errorMassage = 'Email address is not valid';
            } else if (error.status === 409) {
              this.mailInputValidation = false;
              this.popupSubmitDisabled = false;
              this.serverError = true;
              this.errorMassage = 'The user with this email already exists.';
            } else if (error.status === 401 || error.status === 403) {
              this.logout();
            } else {
              this.serverError = true;
              this.mailInputValidation = true;
              this.popupSubmitDisabled = true;
              this.serverError = true;
              this.errorMassage = ' Something went wrong.';
            }
          });
          clearUser = JSON.stringify(this.changeableUser);
          this.users[this.editableUserIndex] = JSON.parse(clearUser);
        }
      }

    } else {
      this.mailInputValidation = false;
      this.popupSubmitDisabled = false;
    }
  }

  // cancel new user popup and clear new user data.
  cancelNewUser() {
    this.isUserPopupActive = false;
    this.popupSubmitDisabled = false;
    this.changeableUser = JSON.parse(JSON.stringify(this.emptyUser));
    this.selectedRole.roleId = 0;
    this.selectedRole.name = '';
    this.selectedRole.action = 'VIEW';
    this.selectedRoleId = 'No id';
    this.mailInputValidation = true;
    this.errorMassage = '';
  }

  // open edit user popup and get editable users data.
  editUser(id, j) {
    this.isUserPopupActive = true;
    this.popupSubmitDisabled = true;
    const copy = JSON.stringify(this.users[j]);
    this.changeableUser = JSON.parse(copy);
    this.editableUserIndex = j;
    this.createOrChangeStatus = 'edit';
    this.createCreateRolesArray();
  }

  // function for creating arry of roles for changeable users.
  createCreateRolesArray() {
    this.createRolesArray = JSON.parse(JSON.stringify(this.rolesArray));
    for (let i = 0; i < this.changeableUser.roleDtos.length; i++) {
      for (let j = 0; j < this.createRolesArray.length; j++) {
        if (this.createRolesArray[j].roleId === this.changeableUser.roleDtos[i].roleId) {
          this.createRolesArray.splice(j, 1);
          j = this.createRolesArray.length;
        }
      }
    }
  }

  // function for getting value from inputs of creat ore change user popup.
  nameInput(status, value) {
    this.changeableUser[status] = value;
    if (status === 'email') {
      this.mailInputValidation = this.checkMailInput(value);
      this.popupSubmitDisabled = this.checkMailInput(value);
    }
  }

  // validation mail input create or change user popup.
  checkMailInput(value) {
    const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = regexp.test(value);
    return valid;
  }

  // function for clean create ore change inputs
  clearInput(status) {
    this.changeableUser[status] = '';
  }

  // function for clear filter date input.
  deleteDate(event) {
    if (event.keyCode === 8) {
      this.date = new FormControl(null);
      this.getDate('');
    } else {
      return false;
    }
  }

  // function, which doesn't allow to input anything
  keyDownRoleInput(event) {
    if (event.keyCode === 8) {
      this.roleFilterInputValue = '';
      this.writeInFilterInputs('role', '');
    } else {
      return false;
    }
  }

  // activate  user in server
  activateUser(id, index) {
    this.users[index].active ?
      this.users[index].active = false :
      this.users[index].active = true;
    this.userManagement.changeUser(this.users[index]).subscribe((data) => {
      },
      error => {
      if (error.status === 401 || error.status === 403) {
          this.logout();
        }
      });
  }

  // open delete popup
  openDeletePopup(index) {
    this.isDeletePopupActive = true;
    this.editableUserIndex = index;
  }

  // close delete popup
  closeDeletePopup(status) {
    if (status === 'yes') {
      this.deleteUser(this.editableUserIndex);
    }
    this.isDeletePopupActive = false;
  }

  // delete user in server
  deleteUser(index) {
    this.userManagement.deleteUser(this.users[index]).subscribe((data) => {
      this.paginationCount = 0;
      this.getUserList(0, 20);
    }, error => {
      if (error.status === 401 || error.status === 403) {
        this.logout();
      }
    });
  }

// activate or deactivate user
  activateNewOrChangeableUser() {
    this.changeableUser.active ?
      this.changeableUser.active = false :
      this.changeableUser.active = true;
  }

// add role in  popup
  addRole() {
    if (this.selectedRoleId !== 'No id') {
      this.changeableUser.roleDtos.push({
        'roleId': +this.rolesArray[this.selectedRoleId].roleId,
        'name': this.rolesArray[this.selectedRoleId].role,
        'action': this.selectedAction,
      });
      this.createCreateRolesArray();
    } else {
      this.isRoleSelected = false;
    }
    this.selectedRoleId = 'No id';
    this.selectedAction = 'VIEW';
    this.selectedRole.roleId = 0;
    this.selectedRole.name = '';
    this.selectedRole.action = 'VIEW';
  }

// ger role name by id
  getRolNameById(id) {
    for (let i = 0; i < this.rolesArray.length; i++) {
      if (id === this.rolesArray[i].roleId) {
        return this.rolesArray[i].role;
      }
    }
  }

  // get user list in time scroll
  scrollEvent(event) {
    this.contentHeight = this.content.nativeElement.clientHeight;
    const scrollCount = event.scrollTop;
    if (this.contentHeight - window.innerHeight < scrollCount && this.getNewUsers) {
      this.getNewUsers = false;
      this.getUserList(this.paginationCount);
    }
  }

  // filter from backend
  writeInFilterInputs(status, value) {
    const isValidFilterText = this.ignoreSpace(value, status);
    this.paginationCount = 0;
    clearTimeout(this.filterTimer);
    if ((this.filter.name ||
      this.filter.date ||
      this.filter.email ||
      this.filter.phoneNumber ||
      this.filter.role) && isValidFilterText) {
      this.isFilterStart = true;
      this.filterTimer = setTimeout(() => {
        this.getUserList(0, 20);
      }, 500);
    } else if (isValidFilterText) {
      this.isFilterStart = false;
      this.filterTimer = setTimeout(() => {
        this.getUserList(0, 20);
      }, 500);
    }
  }
// ignore space begin and end string.
  ignoreSpace (value, name) {
    let string = '', status = 'start', string1 = '', isValue = 0;
    if (value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== ' ' && status === 'start') {
          string += value[i];
          status = 'middle';
        } else if (status === 'middle') {
          string += value[i];
        }
        isValue = 1;
      }
      status = 'end'
      for (let i = string.length - 1; i >= 0; i-- ) {
        if (string[i] !== ' ' && status === 'end') {
          string1 = string[i] + string1;
          status = 'middle';
        } else if (status === 'middle') {
          string1 = string[i] + string1;
        } else {
          isValue = 3;
        }
      }
    }
    this.filter[name] = string1;
    if (isValue === 1) {
      return string1;
    } else if (!isValue) {
      return true;
    } else if (isValue === 3) {
      return false;
    }
  }

  // to correcting date to send server for filter and  send server
  getDate(date) {
    let count = 0,
      day = '', month = '', year = '';
    for (let i = 0; i < date.length; i++) {
      if (date[i] !== '/') {
        if (count === 0) {
          day += date[i];
        } else if (count === 1) {
          month += date[i];
        } else if (count === 2) {
          year += date[i];
        }
      } else {
        count++;
      }
    }
    if (day.length < 1) {
      day = '0' + day;
    }
    if (month.length < 1) {
      month = '0' + month;
    }
    let reversDate;
    if (!isNaN(+day) && !isNaN(+year) && !isNaN(+month) && date) {
      reversDate = (year + '-' + day + '-' + month);
      this.writeInFilterInputs('date', reversDate);
    } else if (!date) {
      reversDate = '';
      this.writeInFilterInputs('date', reversDate);
    } else {
      this.users = [];
    }
  }

  // send request for reset password or resend invitation
  resetPasswordOrInvitation(user, index) {
    this.invitationOrResend = user.hasPassword;
    this.userManagement.resetPasswordOrInvitation(user.id, user.hasPassword).subscribe((data) => {
      this.resetPasswordPopup = true;
    }, error => {
    if (error.status === 401 || error.status === 403) {
      this.logout();
    }
      console.log(error);
    });
    if (user.hasPassword) {
      this.users[index].hasPassword = false;
    }
  }

  // close reset password popup.
  closeResetPasswordPopup() {
    this.resetPasswordPopup = false;
  }

  // forbid to close any popup
  dontClosePopup() {
    this.chaneClosePopup = false;
  }

  // allow to close popup
  closePopup() {
    this.chaneClosePopup = true;
  }

  // close popup when click outside popup.
  clickOutsidePopup(status) {
    if (status === 'addUser') {
      if (this.chaneClosePopup) {
        this.cancelNewUser();
      }
    } else if (status === 'delete') {
      if (this.chaneClosePopup) {
        this.closeDeletePopup(null);
      }
    } else if (status === 'rest') {
      if (this.chaneClosePopup) {
        this.closeResetPasswordPopup();
      }
    }
  }
}

