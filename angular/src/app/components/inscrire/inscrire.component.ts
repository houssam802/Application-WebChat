import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.css']
})
export class InscrireComponent implements OnInit {

  submitted = false;
  errors : any = {};
  userForm !: FormGroup;

  constructor(private formBuilder : FormBuilder,
    private httpClient : HttpClient, 
    private router : Router,
    private authenticationService : AuthenticationService) { }

  invalidNomUtili()
  {
  	return (this.submitted && (this.errors.nomutil != null || this.userForm.controls.nomutil.errors != null));
  }

  invalidEmail()
  {
  	return (this.submitted && (this.errors.email != null || this.userForm.controls.email.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && this.userForm.controls.pword.errors != null);
  }

  invalidConfirmePassword()
  {
  	return (this.submitted && this.userForm.controls.cpword.errors != null);
  }

  ngOnInit()
  {
  	this.userForm = this.formBuilder.group({
  		nomutil: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		pword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern('([a-zA-Z0-9]*)')]],
      cpword: ['', [Validators.required]]
    }, {
      validator: (formGroup:FormGroup) => {
        const control = formGroup.controls["pword"];
        const matchingControl = formGroup.controls["cpword"];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
      }
    });
  }

  onSubmit()
  {
  	this.submitted = true;

  	if(this.userForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
      let data : any = Object.assign(this.userForm.value);
      // We don't need the password confirmation
      let clefs = Object.keys(data);
      let obj : any = {};
      for(let clef of clefs){
        let descriptor = Object.getOwnPropertyDescriptor(data, clef);
        if( clef != "cpword" ){
          obj[clef] = descriptor?.value;
        }
      }
        this.httpClient.post("/api/v1/user/inscrire", obj).subscribe((obs : any) => {
          this.errors = {};
          if(obs.message){
            Object.assign(this.errors, obs.message);
          } else {
            this.authenticationService.setToken(obs.toString());
            //this.router.navigate(["/chat"]);
          }
        })
  	}
  }

}
