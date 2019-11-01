import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, AbstractControl, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import { PasswordService } from '../../services/password/password.service';
import {Router} from '@angular/router';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  inputText = 'RESET';
  hideForPassword = true;
  hideForConfirmPassword = true;
  token = '';
  address = '';
  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordRequire: ['']
  }, {
    validator: [this.MatchPassword]
  });
  input = new MyErrorStateMatcher();

  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('passwordRequire').value; // to get value in input tag

    if (password !== confirmPassword || !password || !confirmPassword) {
      AC.get('passwordRequire').setErrors({MatchPassword: true});
    } else {
      AC.get('passwordRequire').setErrors(null);
      return null;
    }
  }

  constructor(private fb: FormBuilder, private service: PasswordService, private router: Router) {
  }

  ngOnInit() {
    this.getTokenAndAddressFromUrl();
    this.logout();
  }
  logout() {
    localStorage.removeItem('menu-user');
  }
  getTokenAndAddressFromUrl() {
    const href = window.location.href;
    this.address = '', status = 'token';
    for (let i = href.length - 1; i >= 0; i--) {
      if (href[i] === '=') {
        status = '';
      } else if (href[i + 1] === '?') {
        status = 'address';
      } else if (href[i] === '/') {
        status = '';
      }
      if (status === 'token') {
        this.token = (href[i] + this.token);
      } else if (status === 'address') {
        this.address = (href[i] + this.address);
      }
    }
    if (this.address === 'activate') {
      this.inputText = 'ACTIVATE';
    }
  }

  // for reset password of the user or resend invitation email
  changePasswordOrResendActivation() {
    if (this.passwordForm.valid) {
      this.service.sendNewPassword(this.passwordForm.controls.passwordRequire.value, this.token, this.address)
        .subscribe(() => {
          this.router.navigate(['dashboard']);
        }, (error) => {
          console.log(error);
        });
    } else {
    }
  }
}
