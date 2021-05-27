import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token : string = '';  

  constructor() { }

  getToken() {
    return this.token;
  }

  setToken(token : string){
    this.token = token;
  }

}
