import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { LoadUserComponent } from './components/load-user/load-user.component';
import { AuthGuard } from './guards/auth.guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
