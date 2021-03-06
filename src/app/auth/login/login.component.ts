import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  invalidCredentials = false;
  forbiddenUsernames = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {} // TODO: authService in back-end

  ngOnInit() {
    this.invalidCredentials = false;
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.pattern('^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$')]],
      'password': ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$')]]
    });
  }

  get formControls() { return this.loginForm.controls; }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) { return; }
    this.authService.login(this.loginForm.value)
      .subscribe(
        data => {
          this.invalidCredentials = false;
          this.router.navigate(['home']);
          this.loginForm.reset();
        },
        error => {
          console.log('error section of login()');
          console.log(error);
          const errorJson = JSON.parse(JSON.stringify(error))
          if (errorJson.status === 400 || errorJson.status === 404) {
            console.log('Invalid credentials');
            this.invalidCredentials = true;
          }
        }
      );
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

}
