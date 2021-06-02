import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { utilisateur } from '../utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http : HttpClient) { }

  getUtilisateurs () : Observable<utilisateur[]>{
    return this.http.get<utilisateur[]>('/api/v1/user/list');
  }
}
