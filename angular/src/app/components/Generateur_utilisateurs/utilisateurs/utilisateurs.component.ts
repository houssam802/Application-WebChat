import { Component, OnInit } from '@angular/core';
import { utilisateur } from 'src/app/utilisateur';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {

  utils?: utilisateur[];

  constructor(private util_service : UtilisateurService) { }

  ngOnInit(): void {
    this.util_service.getUtilisateurs().subscribe((utils : any) => (
      this.utils = utils
    ))
  }

}
