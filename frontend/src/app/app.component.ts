import { Component } from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  email = 'foo@mail';
  password = '1234';
  loggedIn;
  balance;

  constructor(
    private authService: AuthService
  ) {
    this.authService.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  doLogin() {
    this.authService.login(this.email, this.password)
  }

  doGetBalance() {
    this.authService.getBalance()
    this.balance = this.authService.balance
  }

  doLogout() {
    this.authService.logout()
  }
}
