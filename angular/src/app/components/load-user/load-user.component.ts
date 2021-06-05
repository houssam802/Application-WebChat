import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import  jwtDecode  from 'jwt-decode';
import { utilisateur } from 'src/app/models/utilisateur';

@Component({
  selector: 'app-load-user',
  templateUrl: './load-user.component.html',
  styleUrls: ['./load-user.component.css']
})
export class LoadUserComponent implements OnInit {

  @Input() user ?: utilisateur;
  photo: any;

  constructor(private authService: AuthenticationService, 
    private router: Router,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    /*if( this.authService.getToken() != '' ) {
      
    } else {
      this.router.navigate(['/']);
    }*/
  }

}
