import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {messages} from 'src/app/models/messages'
import { AuthService } from 'src/app/services/auth.service';
import { TelechargerService } from 'src/app/services/telecharger.service';
import { stockerFichier, doneloadingfile, envoiMessage, loadingfile } from './ChatFonctions';


@Component({
  selector: 'app-zone-msgs',
  templateUrl: './zone-msgs.component.html',
  styleUrls: ['./zone-msgs.component.css']
})
export class ZoneMsgsComponent implements OnInit,AfterViewInit {

  @Input() msgs?:messages[];
  @Input() socket : any;
  @Input() amie : any;
  @Output()  message_received = new EventEmitter();

  send_msg !: FormGroup;

  messages : any;

  form : any;
  input : any;
  fileLoader : any;
  file : any;
  bufferTotal = new ArrayBuffer(0);
  confirmation : String = "";
  
  constructor(private formBuilder : FormBuilder,
     private authService : AuthService,
     private telechargerService : TelechargerService) { }

  ngOnInit(): void {
    this.send_msg =this.formBuilder.group({
      message : [''],
    });
  }


  msg : messages={};

  onsend(){
    if(this.send_msg?.value.message!=""){
      var idEmetteur = this.authService.getUtilisateur().id;
      this.msgs?.push(envoiMessage(idEmetteur, "text", this.send_msg?.value.message));

      let infos_message_received={
        id_emet:this.amie.id,
        chat_infos : {
            der_msg:this.send_msg?.value.message,
            msg_non_lue:0
        }
      }
      this.message_received.emit(infos_message_received);


      this.socket.emit("private message", {
        time:new Date().toLocaleString(),
        content : this.send_msg?.value.message,
        ID_dest: this.amie.id,
        ID_emet: idEmetteur
      });
      this.send_msg?.get('message')?.setValue('');
      
    }
    
  }


  ngAfterViewInit(){
    // scrollBar 
    $('#messages').on('DOMNodeInserted', () => {
      var element = document.getElementById("messages")!;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      },1)
    })
    //----------------------------------

    this.socket.on("private message", ({time,content,ID_emet,ID_dest}:any) => {
      var chat_infos = {
          der_msg:content,
          msg_non_lue:1
      }
      if(this.amie!=undefined && this.amie.id==ID_emet){
        this.msgs?.push(envoiMessage(ID_emet, "text", content, time));
        var element = document.getElementById("user")!;
        element.scrollTop = 450;

        this.socket.emit("message_lue", {
          time:time,
          content : content,
          ID_dest: ID_dest,
          ID_emet: ID_emet
        });

        chat_infos.msg_non_lue=0;
      }
      let infos_message_received={
        id_emet:ID_emet,
        chat_infos : chat_infos
      }
      this.message_received.emit(infos_message_received);
    });


    this.socket.on("File", (fileName: any, time: any, ID_emet: any,ID_dest : any) => {
      var chat_infos = {
        der_msg:fileName,
        msg_non_lue:1
      }
      if(this.amie!=undefined && this.amie.id==ID_emet){
        this.msgs?.push(envoiMessage(ID_emet, "file", fileName, time));

        this.socket.emit("message_lue", {
          time:time,
          content : fileName,
          ID_dest: ID_dest,
          ID_emet: ID_emet
        });

        chat_infos.msg_non_lue=0;
      }

      let infos_message_received={
        id_emet:ID_emet,
        chat_infos : chat_infos
      }
      this.message_received.emit(infos_message_received);
    });
    
  }

  file_up(event: any){
    this.file = event.target.files[0];
    if(this.file){
      this.form = document.getElementById("form");
      var fileName = this.file.name;
      var idEmetteur = this.authService.getUtilisateur().id;
      this.msgs?.push(envoiMessage(idEmetteur, "file", fileName));
      var element : any;
      setTimeout(() => {
        element = document.querySelector('.messages li:last-child .file .fa');
        loadingfile(element);
      }, 10);
      stockerFichier(this.form).done((data) => {
        this.socket?.emit("File",{
          content : fileName,
          ID_dest: this.amie.id,
          ID_emet: idEmetteur,
          time:new Date().toLocaleString()
        });
  
        let infos_message_received={
          id_emet:this.amie.id,
          chat_infos : {
              der_msg:this.file.name,
              msg_non_lue:0
          }
        }
        this.message_received.emit(infos_message_received);
        this.confirmation = "Fichier envoyer ";
        var message = document.querySelector('#zoneMessagerie > div:nth-child(1) > div');
        message?.classList.add("show");
        setTimeout(() => {
          message?.classList.add("hide");
        }, 2000)
        setTimeout(() => {
          message?.classList.remove('hide');
          message?.classList.remove('show');
        }, 3000)
        doneloadingfile(element);
      });
    }
  }

  isEmetteur(id: any){
    return this.amie.id != id;
  }

  telecharger(event: any){
    var nomFichier = event.target.id;
    loadingfile(event.target)
    this.telechargerService.telechargerFichier(nomFichier).subscribe( (response: any) => {
      if(!response.message){
        var a = document.createElement("a");
        a.setAttribute("href", response);
        a.setAttribute("download", nomFichier);
        a.style.display = "none";
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
        doneloadingfile(event.target)
      } else {
        doneloadingfile(event.target);
        this.confirmation = "Fichier introuvable";
        var message = document.querySelector('#zoneMessagerie > div:nth-child(1) > div');
        message?.classList.add("show");
        setTimeout(() => {
          message?.classList.add("hide");
        }, 2000)
        setTimeout(() => {
          message?.classList.remove('hide');
          message?.classList.remove('show');
        }, 3000)
      }
    });
  }

}

