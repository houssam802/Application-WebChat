import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    var spans : any = document.getElementsByClassName("lien");
    for(  let span of spans ) {
      span.onclick = () => { this.toggle() };
    }
  }

  toggle(){
    document.querySelector(".form-contenu .form-gauche")?.classList.toggle("active");
    document.querySelector(".form-contenu .form-droit")?.classList.toggle("active");
    var listInput : any = document.getElementsByTagName("input");
    for( let input of listInput) {
        if( input.type !== "submit"){
            input.value = "";
        }
    }
  }

}
