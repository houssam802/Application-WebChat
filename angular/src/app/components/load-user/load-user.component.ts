import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import  jwtDecode  from 'jwt-decode';

@Component({
  selector: 'app-load-user',
  templateUrl: './load-user.component.html',
  styleUrls: ['./load-user.component.css']
})
export class LoadUserComponent implements OnInit, AfterViewInit {

  user: any;
  photo: any;

  constructor(private authService: AuthenticationService, 
    private router: Router,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    if( this.authService.getToken() != '' ) {
      
    } else {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit(): void {
    var decode: any = jwtDecode(this.authService.getToken());
    var id = decode.user.id;
    this.httpClient.get('api/v1/user/' + id).subscribe(( response: any ) => {
      this.user = response.nom;
      var buffer = response.photo.data;
      var mimeType = "data:" + response.mimeType + ";base64";
      var binary = '';
      for (var i = 0; i < buffer.length; ++i) {
          binary += String.fromCharCode(buffer[i]);
      }
      var base64 = btoa(binary);
      this.photo = mimeType + "," + base64;
      var divPhoto : any = document.getElementsByClassName('photo')[0];
      var divUser : any = document.getElementsByClassName('user')[0];
      divUser.id = id;
      divPhoto.style.backgroundImage = `url(${this.photo})`;
    });
  }

}
