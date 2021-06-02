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
<<<<<<< HEAD
import { UtilisateursComponent } from './components/Generateur_utilisateurs/utilisateurs/utilisateurs.component';
import { UtilisateurComponent } from './components/Generateur_utilisateurs/utilisateur/utilisateur.component';
=======
import { LoadUserComponent } from './components/load-user/load-user.component';
>>>>>>> 31f48d0bd39323acc457a75e5298a85c9f0615af


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthComponent,
    InscrireComponent,
    AccueilComponent,
<<<<<<< HEAD
    UtilisateursComponent,
    UtilisateurComponent
=======
    LoadUserComponent
>>>>>>> 31f48d0bd39323acc457a75e5298a85c9f0615af
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
