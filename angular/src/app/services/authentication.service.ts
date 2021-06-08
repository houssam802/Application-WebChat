import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token : string = '';  

  constructor(private httpClient: HttpClient) { }

  isLogged() {
    if( localStorage.getItem('token') ) return true;
    return false;
  }

  getToken(){ return "dd" }
  setToken(token : string){
    this.token = token;
  }

  getUtilisateur() {
    var decode: any = jwtDecode(this.token);
    var id = decode.user.id;
    var nom = decode.user.nom;
    var image;
    this.httpClient.get('api/v1/user/' + id).subscribe(( response: any ) => {
      var buffer = response.photo.data;
      var mimeType = "data:" + response.mimeType + ";base64";
      var binary = '';
      for (var i = 0; i < buffer.length; ++i) {
          binary += String.fromCharCode(buffer[i]);
      }
      var base64 = btoa(binary);
      image = mimeType + "," + base64;
    });
    var utilisateur : utilisateur = {
      id: id,
      nom: nom,
      image: image
    }
    return utilisateur;
  }

}
