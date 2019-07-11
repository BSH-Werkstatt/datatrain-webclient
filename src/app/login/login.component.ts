import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultService, User } from '../../swagger';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * Constructor
   */
  constructor(private router: Router, private defaultService: DefaultService) {}

  /**
   * The e-mail address of the user
   */
  loginEmail: string;
  /**
   * The password of the user
   */
  loginPassword: string;

  /**
   * Set to true if the logic credentials were false
   */
  wrongCredentials = false;

  /**
   * Execute on controlle initialization
   */
  ngOnInit(): void {
    localStorage.removeItem('datatrainUser');
    localStorage.removeItem('datatrainUserToken');
  }

  /**
   * Sends the login form data to the server and determines if the user can log in
   */
  login() {
    if (this.loginEmail) {
      this.defaultService.getUserByEmail(this.loginEmail).subscribe((user: User) => {
        if (user.email === 'ERROR_NOT_FOUND' || user.id === 'ERROR_NOT_FOUND') {
          this.wrongCredentials = true;
        } else {
          // user validated
          localStorage.setItem('datatrainUser', JSON.stringify(user));
          localStorage.setItem('datatrainUserToken', user.id);

          this.router.navigateByUrl('/campaigns');
        }
      });
    }
  }
}
