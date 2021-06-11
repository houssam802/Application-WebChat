import { Component, OnInit, Input ,Output,EventEmitter} from '@angular/core';
import { utilisateur } from '../../models/utilisateur';
import {UtilisateurService} from '../../services/utilisateurs.service'
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-utilisateur-demande-amie',
  templateUrl: './utilisateur-demande-amie.component.html',
  styleUrls: ['./utilisateur-demande-amie.component.css']
})
export class UtilisateurDemandeAmieComponent implements OnInit {

  @Input() autre_util ?: utilisateur;
  @Input() notification :boolean =false;
  demande_envoyer : boolean= false;
  gerer : boolean =false;


  @Output() Accepter_demande = new EventEmitter < utilisateur > ();  

  PostData() {  
    this.Accepter_demande.emit(this.autre_util);  
  } 

  constructor(private util_serv:UtilisateurService,private auth : AuthService) { }

  ngOnInit(): void {
    this.demande_envoyer = this.autre_util?.demandes_amies_envoyer!;
  }

  getID(){
  }

  Demande_amie(){
    this.util_serv.demande_amie(this.auth.getUtilisateur().id,this.autre_util?.id).subscribe();
    this.demande_envoyer=true;
  }

  Annuler_Demande_amie(){
    this.util_serv.annule_demande_amie(this.auth.getUtilisateur().id,this.autre_util?.id).subscribe();
    this.demande_envoyer=false;
  }

  Accepter_demande_amie(){
    this.util_serv.accepter_demande_amie(this.autre_util?.id,this.auth.getUtilisateur().id).subscribe();
    this.PostData();
    this.gerer=true;
  }

  Refuser_Demande_amie(){
    this.util_serv.annule_demande_amie(this.auth.getUtilisateur().id,this.autre_util?.id).subscribe();
    this.gerer=true;
  }
}
