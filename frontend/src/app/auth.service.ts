import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn;
  balance;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    const jwtToken = this.getToken();
    this.loggedIn = new BehaviorSubject<boolean>(jwtToken ? true : false);
  }

  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  buildHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if(this.getToken()) {
      headersConfig['Authorization'] = `Token ${this.getToken()}`;
    }

    return new HttpHeaders(headersConfig);
  }

  login(email: string, password: string) {
    this.http.post(`${environment.apiAddress}/login`, {
      email: email,
      password: password
    }).subscribe((resp: any) => {
      this.loggedIn.next(true);
      console.log(resp.token);
      this.saveToken(resp.token)
      this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
    }, (errorResp) => {
      this.loggedIn.next(undefined);
      errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

  logout() {
    console.log("Logging out");
    this.destroyToken();
    this.loggedIn.next(false);
  }

  getBalance() {
    this.http.get(`${environment.apiAddress}/balance`, {
      headers: this.buildHeaders(),
      responseType: 'json'
    }).subscribe((resp: any) => {
      console.log(resp);
      this.balance = resp.balance;
    }, (errorResp) => {
      console.log(errorResp);
      errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

}
