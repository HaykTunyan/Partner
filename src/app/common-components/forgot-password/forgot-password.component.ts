import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordService } from '../../services/password/password.service';
import {Router} from '@angular/router';


// email correct validator, not material.
export function ValidateEmail(control: AbstractControl) {
  if (!control.value) {
    return { validEmail: true };
  } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(control.value)) {
    return { validEmail: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  // title text
  title = 'Send verification Email';
  errorMassage = '';
  form: FormGroup;
  private formSubmitAttempt: boolean;
  incorrectUser = false;

  constructor(
    private fb: FormBuilder,
    private service: PasswordService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', ValidateEmail]
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
      this.service.sendMailForgotPassword(this.form.valid).subscribe(data => {
        this.router.navigate(['/login']);
      }, error => {
        if (error.status === 404) {
          this.errorMassage = 'notFound';
        } else {
          this.errorMassage = 'notServer';
        }
      });
    } else {
      this.form.get('email').markAsTouched();
    }
  }

}
