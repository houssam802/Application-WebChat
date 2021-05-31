import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
      this.httpClient.post("/api/v1/user/auth", this.user.value).subscribe( (obs : any) => {
        this.errors = {};
        if(obs.message){
          Object.assign(this.errors, obs.message);
        } else {
          this.authenticationService.setToken(obs.toString());
          this.router.navigate(['/user']);
        }
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
