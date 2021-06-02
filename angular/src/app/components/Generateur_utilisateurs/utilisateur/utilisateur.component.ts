import { Component, OnInit, Input ,Output } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { utilisateur } from '../../../utilisateur';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  @Input() user ?: utilisateur;

  constructor() { }

  ngOnInit(): void {
  }

  getID(){
    
  }

}
