import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent }       from './start/start.component';
import { LoginComponent }       from './login/login.component';
import { RegisterComponent }    from './register/register.component';
import { CampaignComponent }    from './campaign/campaign.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'campaign', component: CampaignComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
