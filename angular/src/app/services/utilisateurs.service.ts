import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { utilisateur } from '../models/utilisateur';
import { AuthService } from './auth.service';
import { messages } from '../models/messages';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor(private http : HttpClient, public authService: AuthService) { }

  getUtilisateurs () : Observable<utilisateur[]>{
    return this.http.get<utilisateur[]>('/api/v1/user/list/' + this.authService.getUtilisateur().id);
  }

  getamies() : Observable<utilisateur[]>{
    return this.http.get<utilisateur[]>('/api/v1/user/list/amies/' + this.authService.getUtilisateur().id);
  }

  getmsgs(id_emet :any ,id_dest : any) : Observable<JSON>{
    return this.http.get<JSON>('/api/v1/user/msgs/' + id_emet+"_"+id_dest);
  }
}
