import { Component, OnInit ,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { utilisateur } from 'src/app/models/utilisateur';
import {AuthService} from 'src/app/services/auth.service'

@Component({
  selector: 'app-zone-ajout-amie',
  templateUrl: './zone-ajout-amie.component.html',
  styleUrls: ['./zone-ajout-amie.component.css']
})
export class ZoneAjoutAmieComponent implements OnInit {

  @Input() user ?: utilisateur;

  nom :any;
  tab_utils_temp : utilisateur[]=[];

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.tab_utils_temp=[]
  }

  chercher(){
    console.log(this.nom)
    this.tab_utils_temp=[]
    this.auth.chercher_autre_utilisateurs(this.user?.id,this.nom).subscribe((utilisateurs)=>{
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
