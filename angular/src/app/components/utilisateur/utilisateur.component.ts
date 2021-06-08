import { Component, OnInit, Input ,Output } from '@angular/core';
import { utilisateur } from '../../models/utilisateur';
import {UtilisateurService} from '../../services/utilisateurs.service'

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  @Input() user ?: utilisateur;

  constructor(private util:UtilisateurService) { }

  ngOnInit(): void {
  }

  getID(){
  }



}
