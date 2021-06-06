import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

import JwtDecode from 'jwt-decode';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  errors : any = {};

  submitted = false;
  user !: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private httpClient:HttpClient,
    private router:Router,
    private authenticationService : AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.formBuilder.group({
      nom : ['', Validators.required],
      pwd : ['', Validators.required]
    });
  }

  onSubmit(){
    if(this.user.controls.nom.errors == null){
      this.httpClient.post("/api/v1/user/auth", this.user.value).subscribe( (response : any) => {
        this.errors = {};
        if(response.message){
          Object.assign(this.errors, response.message);
        } else {
          localStorage.setItem('token', response.accessToken);
          var decode = JwtDecode(response.accessToken);
          console.log(decode);
          setTimeout(() => {
            console.log(localStorage.getItem('token'));
          }, 5000)
          setTimeout(() => {
            console.log(localStorage.getItem('token'));
          }, 11000)
          /*this.authenticationService.setToken(response.toString());
          this.router.navigate(['/chat']);*/
        }
      }, (error) => {
        console.log(error);
      });
    }
    this.submitted=true;
  }

  invalidPassword():boolean{
  	return (this.submitted && (this.errors.pwd != null || this.user.controls.pwd.errors != null ));
  }

  invalidNomUtili():boolean{
  	return (this.submitted &&  (this.errors.nom != null || this.user.controls.nom.errors != null));
  }

}
