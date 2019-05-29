import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  /**
   * Constructor
   */
  constructor(private router: Router) {}

  /**
   * The e-mail address of the user
   */
  loginEmail: string;
  /**
   * The password of the user
   */
  loginPassword: string;

  /**
   * Execute on controlle initialization
   */
  ngOnInit(): void {}
}
