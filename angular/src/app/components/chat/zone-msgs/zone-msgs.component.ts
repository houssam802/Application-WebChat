import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {messages} from 'src/app/models/messages'
import { AuthService } from 'src/app/services/auth.service';
import { TelechargerService } from 'src/app/services/telecharger.service';
import { sendFileChunk, stockerFichier } from './ChatFonctions';


@Component({
  selector: 'app-zone-msgs',
  templateUrl: './zone-msgs.component.html',
  styleUrls: ['./zone-msgs.component.css']
})
export class ZoneMsgsComponent implements OnInit,AfterViewInit {

  @Input() msgs?:messages[];
  @Input() socket : any;
  @Input() amie : any;
  send_msg !: FormGroup;

  messages : any;

  form : any;
  input : any;
  fileLoader : any;
  file : any;
  bufferTotal = new ArrayBuffer(0);
  
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
      this.socket.emit("private message", {
        time:new Date().toLocaleString(),
        content : this.send_msg?.value.message,
        ID_dest: this.amie.id,
        ID_emet: idEmetteur
      });
      this.input = '';
      this.send_msg?.get('message')?.setValue('');
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }
  }

  

  ngAfterViewInit(){
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
    this.messages = document.getElementById("messages");
    this.form = document.getElementById("form");
    this.input = document.getElementById("input");
    this.fileLoader = document.getElementById("fileUp");
    this.fileLoader.onchange = (event:any) => {
        stockerFichier(this.form);
        this.file = event.target.files[0];
        if(this.file){
          var fileName = this.file.name;
          var idEmetteur = this.authService.getUtilisateur().id;
          this.msgs?.push(envoiMessage(idEmetteur, "file", fileName));
          this.socket?.emit("File",{
            content : fileName,
            ID_dest: this.amie.id,
            ID_emet: idEmetteur,
            time:new Date().toLocaleString()
          });
        }
    }
    this.socket.on("private message", ({time,content,ID_emet}:any) => {
      if(this.amie.id==ID_emet){
        console.log(content);
        this.msgs?.push(envoiMessage(ID_emet, "text", content, time));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
      }
    });

    this.socket.on("File", (fileName: any, time: any, ID_emet: any) => {
      if(this.amie.id==ID_emet){
        this.msgs?.push(envoiMessage(ID_emet, "file", fileName, time));
      }
    });
    
  }

  isEmetteur(id: any){
    return this.amie.id != id;
  }

  telecharger(event: any){
    var nomFichier = event.target.id;
    this.telechargerService.telechargerFichier(nomFichier).subscribe( (response: any) => {
      if(!response.message){
        var a = document.createElement("a");
        a.setAttribute("href", response);
        a.setAttribute("download", nomFichier);
        a.style.display = "none";
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }

}

function envoiMessage(idOWner:string, type: string, content: string, time?: string){
  var msg : messages = {};
  msg.id_personne = Number(idOWner);
  msg.time= time || new Date().toLocaleString();
  msg.content = content;
  msg.type=type;
  return msg;
}
