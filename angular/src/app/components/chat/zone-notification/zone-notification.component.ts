import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { utilisateur } from 'src/app/models/utilisateur';
import {AuthService} from 'src/app/services/auth.service';
import {UtilisateurService} from 'src/app/services/utilisateurs.service'
import { UtilisateurComponent } from '../../utilisateur/utilisateur.component';

@Component({
  selector: 'app-zone-notification',
  templateUrl: './zone-notification.component.html',
  styleUrls: ['./zone-notification.component.css']
})
export class ZoneNotificationComponent implements OnInit {

  @Input() user ?: utilisateur;

  @Output() nouv_amie = new EventEmitter < utilisateur > ();

  ajout_amie(nouv_amie : any) {  
    this.nouv_amie.emit(nouv_amie);  
  } 

  ajouter_amie(amie_ajouter : any){
    this.ajout_amie(amie_ajouter);
  }

  nom :any;
  tab_utils_temp : utilisateur[]=[];

  constructor(private auth:AuthService,private util_serv : UtilisateurService) { }

  ngOnInit(): void {
    this.tab_utils_temp=[]
    this.util_serv.get_demandes_amie().subscribe((utilisateurs) =>{
        if(utilisateurs.length!=0){
          utilisateurs.forEach( (element: any) => {
            var image = "";
            if(element.mime != ""){
              var buffer = element.photo.data;
              var mimeType = "data:" + element.mime + ";base64";
              var binary = '';
              for (var i = 0; i < buffer.length; ++i) {
                  binary += String.fromCharCode(buffer[i]);
              }
              var base64 = btoa(binary);
              image = mimeType + "," + base64;
            }
    
            var utilisateur : utilisateur = {
              id: element.id,
              nom: element.nom,
              image: image,
              demandes_amies_envoyer : element.demandes_envoyer
            };
            this.tab_utils_temp.push(utilisateur);
          })
        }
    })
  }

}
