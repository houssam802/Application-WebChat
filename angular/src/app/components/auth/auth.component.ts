import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


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
    private authService : AuthService) { }

  ngOnInit(): void {
    this.user = this.formBuilder.group({
      nom : ['', Validators.required],
      pwd : ['', Validators.required]
    });
  }

  onSubmit(){
    if(this.user.controls.nom.errors == null){
      this.authService.connexion(this.user.value).subscribe( (response : any) => {
        this.errors = {};
        if(response.message){
          Object.assign(this.errors, response.message);
        } else {
          this.router.navigate(['/chat']);
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
