import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { io } from 'socket.io-client';
import { AuthService } from '../../services/auth.service';

import { chat_infos, utilisateur } from 'src/app/models/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateurs.service';
import { messages } from 'src/app/models/messages';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, AfterViewInit {

  user ?: utilisateur;
  utils : utilisateur[] = [];
  tab_utils_temp : utilisateur[] =[];
	chat !: FormGroup;
  socket : any;

  msgs ?: messages[];
  amie ?: utilisateur;

  demandes:boolean=false;


  clicked : boolean = false;


  ajouter_amie(nouv_amie : any) {
    console.log(nouv_amie)
    this.utils.push(nouv_amie)
    this.tab_utils_temp.push(nouv_amie)
  }

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
      autoConnect: true
    })
    this.socket.auth = {id : this.user?.id, username : this.user?.nom };
        
    this.utilService.getamies().subscribe((utilisateurs : any) => {
      if(!utilisateurs.amie){
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

          var chat_infos : chat_infos = {
              msg_non_lue:element.msg_non_lue,
              der_msg:element.der_msg,
          }
          var utilisateur : utilisateur = {
            id: element.id,
            nom: element.nom,
            email:element.email,
            image: image,
            chat_infos : chat_infos
          };
          this.utils.push(utilisateur);
          this.tab_utils_temp.push(utilisateur);
        });
      }
    })

    this.socket.on('user connected', (amieID : any) => {
      var utilisateur: any = document.getElementById(amieID);
      var status = utilisateur.getElementsByClassName('contact-status')[0];
      status.classList.remove('offline');
      status.classList.add('online');
    })

    this.socket.on('user disconnected', (amieID : any) => {
      console.log(amieID);
      var utilisateur: any = document.getElementById(amieID);
      var status = utilisateur.getElementsByClassName('contact-status')[0];
      status.classList.remove('online');
      status.classList.add('offline');
    })



    this.utilService.get_demandes_amie().subscribe((utilisateurs) =>{
      if(utilisateurs.length!=0){
        this.demandes=true;
      }
    })

  }

  ngAfterViewInit(){
    this.socket.on('users', (amieID: any) => {
      setTimeout(() => {
        amieID.forEach((element:any) => {
          var utilisateur = document.getElementById(element);
          var status = utilisateur?.getElementsByClassName('contact-status')[0];
          status?.classList.remove('offline');
          status?.classList.add('online');
        });
      }, 500);
      
    })
  
  }


 

  click_user(infos : any){
    this.tab_utils_temp.every(elem => {
      if(elem.id == infos.id){
        elem.chat_infos ={
          msg_non_lue:0,
          der_msg:elem?.chat_infos?.der_msg,
       }
       return false
      }else return true
    })

    this.utilService.getmsgs(this.user?.id,infos.id).subscribe((msgs: any) => {
      this.msgs=msgs['messages'];
      this.msgs?.sort( (a,b) => {
        return (Date.parse(a?.time!)/1000)-(Date.parse(b?.time!)/1000)
      })
      this.clicked=true; 
      this.amie={
        nom:infos.nom,
        id:infos.id,
        email:""
      }
    }) 

  }
 
 
 
   search : any;
 
   chercher(event: any) {
     this.tab_utils_temp=[]
      this.utils.forEach((element : any) => {
       if(element.nom.toLowerCase().startsWith(event.target.value.toLowerCase())){
           this.tab_utils_temp.push(element);
       }
     });
       if(event.target.value=="") this.tab_utils_temp= this.utils;
     } 
 
 
 

     message_received(msg : any){
       this.tab_utils_temp.every(elem => {
        if(elem.id == msg.id_emet){
          elem.chat_infos ={
            msg_non_lue:elem.chat_infos?.msg_non_lue! + msg.chat_infos?.msg_non_lue,
            der_msg:msg.chat_infos.der_msg,
        }
          return false
        }else return true
      })
     }


     vue_demandes(elem : any){
       console.log(elem.target.parentElement)
       elem.target.parentElement.childNodes.forEach((element:any) => {
         console.log(element)
            element.classList.remove("demandes");
       });
     }


     signout(){
       this.socket.emit("disconnected",{});
       window.localStorage.clear();
       window.location.reload();
     }

     
}