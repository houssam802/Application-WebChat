import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { LoadUserComponent } from './components/load-user/load-user.component';
import { AuthGuard } from './guards/auth.guard';
import {ZoneMsgsComponent} from './components/chat/zone-msgs/zone-msgs.component'

const routes: Routes = [
  {
    path : "",
    component: AccueilComponent
  },
  {
    path : "accueil",
    component: AccueilComponent
  },
  {
    path : "chat",
    component: ChatComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path : "user",
    component: LoadUserComponent
  },
  {
    path : "chat/msgs",
    component: ZoneMsgsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
