import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from '../../services/auth.service';

import { chat_infos, utilisateur } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateurs.service';
import { messages } from 'src/app/models/messages';
import { tap } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {

  user ?: utilisateur;
  utils : utilisateur[] = [];
	chat !: FormGroup;
  socket : any;


  clicked : boolean = false;

  constructor(private formBuilder : FormBuilder, 
    private route : ActivatedRoute, 
    private httpClient : HttpClient,
    private authService : AuthService,
    private utilService: UtilisateurService)
  {

  }

  ngOnInit()
  {
    this.user = this.authService.getUtilisateur();
    this.socket =  io("http://localhost:3000", { 
          autoConnect: true,
          transportOptions: {
            polling: {
              extraHeaders: {
                'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')!,
              }
            }
          }
        })
        this.socket.auth={id : this.user?.id};

        
      this.utilService.getamies().subscribe((utilisateurs : any) => {
        utilisateurs.forEach( (element: any) => {
          var id = element.id;
          var nom = element.nom;
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

          var chat_infos : chat_infos = {
             msg_non_lue:element.msg_non_lue,
             der_msg:element.der_msg,
          }
          var utilisateur : utilisateur = {
            id: id,
            nom: nom,
            image: image,
            chat_infos : chat_infos
          };
          this.utils.push(utilisateur);
        });
    })
    console.log(this.utils);


  }


 msgs ?: messages[];
 amie ?: utilisateur;

  onclick(elem:any){
    let amie=elem.split(',');
    this.utilService.getmsgs(this.user?.id,amie[0]).subscribe((msgs: any) => {
      this.msgs=msgs['messages'];
      this.clicked=true; 
      this.amie={
        nom:amie[1],
        id:amie[0]
      }
    })
  }
}