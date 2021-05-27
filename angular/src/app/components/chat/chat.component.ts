import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { io } from 'socket.io-client';
import { myFunc } from './ChatFonctions';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, AfterViewInit {

  user : any = { nom: '' }; 
	chat !: FormGroup;
  socket : any = io("http://localhost:3000", { autoConnect: false });
  username : any;
  messages : any;
  form : any;
  input : any;
  fileLoader : any;
  file : any;
  bufferTotal = new ArrayBuffer(0);

  constructor(private formBuilder: FormBuilder, private route:ActivatedRoute, private httpClient:HttpClient)
  {

  }

  ngOnInit()
  {
    new Promise((resolve, reject) => {
      this.route.params.subscribe( (data:any) => {
        this.httpClient.get("/api/v1/user/").subscribe( obj => {
          this.user = obj;
          resolve(obj);
        });
      })
    }).then(
      (res) => {
        this.socket.auth = res;
        this.socket.connect();
      }
    )

  }


  ngAfterViewInit(){
    this.messages = document.getElementById("messages");
    this.form = document.getElementById("form");
    this.input = document.getElementById("input");
    this.fileLoader = document.getElementById("fileUp");
    this.socket.on("users", (users : any) => {
      users.forEach((user : any) => {
        if( user.username != document.cookie.split("=")[1] ){
          this.createUser(user);
        }
      });
    });
    this.socket.on("user connected", (user : any) => {
      this.createUser(user);
    });
  }

  createUser(user : any){
    var divUser : any = document.querySelectorAll("#side1 > div");
    for( let utilis of divUser ){
      if(utilis.innerText === user.username){
        utilis.style.setProperty("--connected", "green");
        utilis.setAttribute("id", user.userID + "," + user.username);
        utilis.onclick = () => {
          myFunc(utilis.id, this.form, this.input, this.messages, this.fileLoader, this.file, this.bufferTotal, this.socket);
        }
      }
    }
  }
}