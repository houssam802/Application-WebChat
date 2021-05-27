import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AuthComponent } from './components/auth/auth.component';
import { InscrireComponent } from './components/inscrire/inscrire.component';

const routes: Routes = [
  {
    path : "auth",
    component: AuthComponent
  },
  {
    path : "chat",
    component: ChatComponent
  },
  {
    path : "inscrire",
    component: InscrireComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
