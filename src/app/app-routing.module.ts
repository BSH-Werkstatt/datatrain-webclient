import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CampaignComponent } from './campaign/campaign.component';

const routes: Routes = [
  {
    path: 'campaigns',
    component: CampaignsComponent,
    data: { animation: 'AboutPage' }
  },
  { path: '', component: LoginComponent, data: { animation: 'HomePage' } },
  {
    path: 'register',
    component: RegisterComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'campaigns/:urlName',
    component: CampaignComponent,
    data: { animation: 'HomePage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
