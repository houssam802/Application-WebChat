import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,of } from 'rxjs';
import { utilisateur } from '../models/utilisateur';
import { AuthService } from './auth.service';
import { messages } from '../models/messages';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {


  private resultList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null!);
  public resultList$: Observable<any[]> = this.resultList.asObservable();
  
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

  demande_amie(id_emet :any,id_dest :any){
    return this.http.put('/api/v1/user/demande_amie',{id_emet : id_emet,id_dest : id_dest});
  }

  annule_demande_amie(id_emet :any,id_dest :any){
    return this.http.delete('/api/v1/user/annule_demande_amie/'+ id_emet+"_"+id_dest);
  }

  accepter_demande_amie(id_emet :any,id_dest :any){
    return this.http.put('/api/v1/user/accepter_demande_amie',{id_emet : id_emet,id_dest : id_dest});
  }

  get_demandes_amie() : Observable<utilisateur[]>{
    return this.http.get<utilisateur[]>('/api/v1/user/list_demandes_amie/' + this.authService.getUtilisateur().id);
  }

}
