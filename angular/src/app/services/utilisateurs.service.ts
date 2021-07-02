import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { utilisateur } from '../models/utilisateur';
import { AuthService } from './auth.service';

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

  updatemsgs(id_emet :any ,id_dest : any,msgs : any) : Observable<any>{
    return this.http.put('/api/v1/user/read_msgs/' + id_emet+"_"+id_dest,msgs);
  }

  chercher_autre_utilisateurs(id: any,nom : string): Observable<utilisateur[]>{
    return this.http.post<utilisateur[]>('/api/v1/user/search',{id:id,nom:nom});
   }

  demande_amie(id_emet :any,id_dest :any): Observable<any>{
    console.log(id_emet + ' :: ');
    return this.http.put('/api/v1/user/demande_amie', {id_emet : id_emet,id_dest : id_dest});
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
