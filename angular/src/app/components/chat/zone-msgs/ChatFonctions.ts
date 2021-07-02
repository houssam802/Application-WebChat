import * as $ from "jquery";
import { messages } from "src/app/models/messages";

export function stockerFichier(form : HTMLFormElement){
  let formData = new FormData(form);
  return $.ajax({
    url: "/api/v1/user/stockerFichier",
    type: 'POST',
    dataType: "JSON",
    headers: {
      "Authorization" : "Bearer " + localStorage.getItem('token')
    },
    data: formData,
    processData: false,
    contentType: false
  })
}

export function envoiMessage(idOWner:string, type: string, content: string, time?: string){
  var msg : messages = {};
  msg.id_personne = Number(idOWner);
  msg.time= time || new Date().toLocaleString();
  msg.content = content;
  msg.type=type;
  return msg;
}


export function loadingfile(elem : any){
  elem.classList.remove("fa");
  elem.classList.remove("fa-arrow-down");
  elem.classList.add("spinner");
}


export function doneloadingfile(elem : any){
  elem.classList.add("fa");
  elem.classList.add("fa-arrow-down");
  elem.classList.remove("spinner");
}