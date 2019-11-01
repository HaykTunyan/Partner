// Login Component file

import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { AuthService } from './../auth/auth.service';

// email correct validator, not material.
export function ValidateEmail(control: AbstractControl) {
  if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(control.value)) {
    return { validEmail: true };
  }
  return null;
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// export Login Component
export class LoginComponent implements OnInit {

  // title text
  title = 'Sign In';
  forgot = 'Forgot password?';

  form: FormGroup;
  private formSubmitAttempt: boolean;
  incorrectUser = false;
  inactive = false;
  serverError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', ValidateEmail],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
      this.authService.correctPasswordAndLogin.subscribe(data => {
       if (data === 'unauthorised') {
         this.incorrectUser = true;
         this.serverError = false;
         this.inactive = false;
       } else if (data === 'serverError') {
         this.incorrectUser = false;
         this.inactive = false;
         this.serverError = true;
       } else if (data === 'inactive') {
         this.incorrectUser = false;
         this.inactive = true;
         this.serverError = false;
       } else {
         this.incorrectUser = false;
         this.serverError = false;
         this.inactive = false;
       }});
    }
    this.formSubmitAttempt = true;
  }
}
