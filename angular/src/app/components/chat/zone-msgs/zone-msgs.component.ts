import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {messages} from 'src/app/models/messages'
import { AuthService } from 'src/app/services/auth.service';
import { myFunc, stockerFichier } from './ChatFonctions';


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
  
  constructor(private formBuilder : FormBuilder, private authService : AuthService) { }

  ngOnInit(): void {
    this.send_msg =this.formBuilder.group({
      message : [''],
    });
    console.log(this.socket)
  }


  msg : messages={};

  onsend(){
    if(this.send_msg?.value.message!=""){
      this.msgs?.push(envoiMessage("text", this.send_msg?.value.message));
      this.socket.emit("private message", {
        time:new Date().toLocaleString(),
        content : this.input.value,
        ID_dest: this.amie.id,
        ID_emet: this.authService.getUtilisateur().id
      });
      this.input = '';
    }
  }

  

  ngAfterViewInit(){
      this.messages = document.getElementById("messages");
      this.form = document.getElementById("form");
      this.input = document.getElementById("input");
      this.fileLoader = document.getElementById("fileUp");
      this.fileLoader.onchange = (event:any) => {
        stockerFichier(this.form);
          this.file = event.target.files[0];
          var fileName = this.file.name;
          var reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = () => {
          var blob : any = reader.result;
          let dataMime = blob.split(",")[0];
          this.msgs?.push(envoiMessage("file", fileName));
          let boucle, pas;
          if( this.file.size > 100000 ){
            boucle = Math.round(this.file.size/100000);
            pas = Math.round(this.file.size/boucle);
          } else {
            pas = 100000;
          }
          this.socket?.emit("File",{
            pas: pas,
            dataMime: dataMime,
            content : fileName,
            ID_dest: this.amie.id,
            ID_emet: this.authService.getUtilisateur().id,
            time:new Date().toLocaleString()
          });

        }
      }
      this.socket.on("private message", (time : any,ID_emet:any,content: any) => {
        this.msgs?.push(envoiMessage("text",content));
      });
      /*this.socket.on("users", (users : any) => {
        users.forEach((user : any) => {
          if( user.username != document.cookie.split("=")[1] ){
            this.createUser(user);
          }
        });
      });
      this.socket.on("user connected", (user : any) => {
        this.createUser(user);
      });*/
      //myFunc(this.amie.id, this.authService.getUtilisateur(), this.form, this.input, this.messages, this.fileLoader, this.file, this.bufferTotal, this.socket); 
  }


  /*createUser(user : any){
    var divUser : any = document.querySelectorAll("#side1 > div");
    for( let utilis of divUser ){
      if(utilis.innerText === user.username){
        utilis.style.setProperty("--connected", "green");
        utilis.setAttribute("id", user.userID + "," + user.username);
        utilis.onclick = () => {
          //myFunc(utilis.id, this.user, this.form, this.input, this.messages, this.fileLoader, this.file, this.bufferTotal, this.socket);
        }
      }
    }
  }*/

}

function envoiMessage(type: string, content: string){
  var msg : messages = {};
  msg.time=new Date().toLocaleString();
  msg.content = content;
  msg.type=type;
  return msg;
}
