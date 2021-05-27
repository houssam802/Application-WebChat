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
    var inscImage : any = document.querySelector('.form-contenu .form-gauche .inscrire');
    inscImage.style.backgroundImage = "url('../../../assets/Images/inscrire.png')";
    var authImage : any = document.querySelector('.form-contenu .form-gauche .auth');
    authImage.style.backgroundImage = "url('../../../assets/Images/auth.jpg')";
    var spans : any = document.getElementsByClassName("lien");
    for(  let span of spans ) {
      span.onclick = () => { this.toggle() };
      span.tabIndex = -1;
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
