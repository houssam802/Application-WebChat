import { Component, OnInit, Input, Output,EventEmitter  } from '@angular/core';
import { UtilisateurService } from 'src/app/services/utilisateurs.service';
import { chat_infos, utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  @Input() user ?: utilisateur;

  constructor(private utilServ : UtilisateurService) { }

  ngOnInit(): void {
  }

  @Output() infos = new EventEmitter < utilisateur > (); 

  onclick(elem:any){
    this.infos.emit(this.user);  
  }

}
