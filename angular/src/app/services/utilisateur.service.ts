import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { utilisateur } from '../models/utilisateur';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http : HttpClient, public authService: AuthenticationService) { }

  getUtilisateurs () : Observable<utilisateur[]>{
    return this.http.get<utilisateur[]>('/api/v1/user/list/' + this.authService.getUtilisateur().id);
  }
}
