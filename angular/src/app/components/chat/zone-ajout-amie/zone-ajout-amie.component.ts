import { Component, OnInit ,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { utilisateur } from 'src/app/models/utilisateur';
import {UtilisateurService} from 'src/app/services/utilisateurs.service'

@Component({
  selector: 'app-zone-ajout-amie',
  templateUrl: './zone-ajout-amie.component.html',
  styleUrls: ['./zone-ajout-amie.component.css']
})
export class ZoneAjoutAmieComponent implements OnInit {

  @Input() user ?: utilisateur;

  nom :any;
  tab_utils_temp : utilisateur[]=[];

  constructor(private util_serv:UtilisateurService) { }

  ngOnInit(): void {
    this.tab_utils_temp=[]
  }

  chercher(nom:any){
    console.log(this.user?.id)
    this.tab_utils_temp=[]
    this.util_serv.chercher_autre_utilisateurs(this.user?.id,nom.target.value).subscribe((utilisateurs)=>{
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
    })
  }
}
