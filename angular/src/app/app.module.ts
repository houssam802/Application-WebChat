import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthComponent } from './components/auth/auth.component';
import { InscrireComponent } from './components/inscrire/inscrire.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { UtilisateurComponent } from './components/utilisateur/utilisateur.component';
import { LoadUserComponent } from './components/load-user/load-user.component';
import {ZoneMsgsComponent} from './components/chat/zone-msgs/zone-msgs.component'
import { AuthGuard } from './guards/auth.guard';
import { ZoneAjoutAmieComponent } from './components/chat/zone-ajout-amie/zone-ajout-amie.component';
import { UtilisateurDemandeAmieComponent } from './components/utilisateur-demande-amie/utilisateur-demande-amie.component';
import { ZoneNotificationComponent } from './components/chat/zone-notification/zone-notification.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthComponent,
    InscrireComponent,
    AccueilComponent,
    UtilisateurComponent,
    LoadUserComponent,
    ZoneMsgsComponent,
    ZoneAjoutAmieComponent,
    UtilisateurDemandeAmieComponent,
    ZoneNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
