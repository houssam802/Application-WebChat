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
      this.msg.time=new Date().toLocaleString();
      this.msg.content=this.send_msg?.value.message;
      this.msgs?.push(this.msg);
    }
  }


  ngAfterViewInit(){
      this.messages = document.getElementById("messages");
      this.form = document.getElementById("form");
      this.input = document.getElementById("input");
      this.fileLoader = document.getElementById("fileUp");
      /*this.fileLoader.onchange = () => {
        stockerFichier(this.form);
      }*/
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
      myFunc(this.amie.id, this.authService.getUtilisateur(), this.form, this.input, this.messages, this.fileLoader, this.file, this.bufferTotal, this.socket); 
  }


  createUser(user : any){
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
  }

}
