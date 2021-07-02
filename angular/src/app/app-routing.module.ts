import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { AuthGuard } from './guards/auth.guard';
import {ZoneMsgsComponent} from './components/chat/zone-msgs/zone-msgs.component'
import { PageNonTrouveComponent } from './components/page-non-trouve/page-non-trouve.component';

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
    path : "chat/msgs",
    component: ZoneMsgsComponent
  },
  {
    path : '404',
    component: PageNonTrouveComponent
  },
  {
    path : '**',
    component: PageNonTrouveComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
