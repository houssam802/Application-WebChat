import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { utilisateur } from 'src/app/models/utilisateur';

@Component({
  selector: 'app-modification-compte',
  templateUrl: './modification-compte.component.html',
  styleUrls: ['./modification-compte.component.css']
})
export class ModificationCompteComponent implements OnInit {

  submitted = false;
  errors : any = {};
  userForm !: FormGroup;

  @Input() user ?: utilisateur;

  constructor(private formBuilder : FormBuilder,
    private httpClient : HttpClient, 
    private router : Router,
    private authService : AuthService) { }

  invalidNomUtili()
  {
  	return (this.submitted && (this.errors.nom != null || this.userForm.controls.nomutil.errors != null));
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

  ngAfterViewInit(){
    setTimeout(() => {
      if(this.user?.image != ""){
        icon.style.backgroundColor = 'transparent';
        icon.style.backgroundImage = `url(${this.user?.image})`;
      } else { 
        icon.style.backgroundImage = "url('../../../assets/Images/profile.png')";
      }
      this.userForm.controls["nomutil"].setValue(this.user?.nom)
      this.userForm.controls["email"].setValue(this.user?.email)

    }, 500);
    var icon : any = document.querySelector('.img');
    var profile : any = document.getElementById("fileUp1");
    profile.onchange = (e : any) => {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      icon.style.backgroundColor = 'transparent';
      icon.style.backgroundImage = `url(${reader.result})`;
      }
    }
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
      var form = document.getElementsByTagName('form')[0];
      var formData = new FormData(form);
      formData.append('id', this.user?.id.toString()!);
      this.envoiForm(formData, this);
  	}
  }

  envoiForm(formData: FormData, inscrireComponent: any){
    $.ajax({
      url: "/api/v1/user/"+this.user?.id,
      type: 'PUT',
      dataType: "JSON",
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
        inscrireComponent.errors = {};
        if(data.message){
          Object.assign(inscrireComponent.errors, data.message);
        } else {
          inscrireComponent.signout();
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  }
  signout(){
    window.localStorage.clear();
    window.location.reload();
  }

}
