import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CampaignComponent } from './campaign/campaign.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { UploadComponent } from './upload/upload.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';

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
  },
  {
    path: 'campaigns/:urlName/annotate/:imageId',
    component: AnnotationComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'campaigns/:urlName/annotate',
    component: AnnotationComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'campaigns/:urlName/upload',
    component: UploadComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'campaigns/:urlName/history',
    component: HistoryComponent,
    data: { animation: 'AboutPage' }
  },
  {
    path: 'campaigns/:urlName/admin',
    component: AdminComponent,
    data: { animation: 'AboutPage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
