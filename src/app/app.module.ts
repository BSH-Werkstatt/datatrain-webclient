import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';

import { ApiModule } from '../swagger/api.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { CampaignComponent } from './campaign/campaign.component';
import { AnnotationComponent, AnnotationSaveDialogComponent } from './annotation/annotation.component';
import { UploadComponent } from './upload/upload.component';
import { HistoryComponent } from './history/history.component';
import { AdminComponent, AdminSnackbarJPEGComponent, AdminSnackbarSavedComponent } from './admin/admin.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { LeaderboardComponent } from './campaign/leaderboard/leaderboard.component';
import { PredictComponent } from './campaign/predict/predict.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CampaignsComponent,
    RegisterComponent,
    CampaignComponent,
    AnnotationComponent,
    UploadComponent,
    HistoryComponent,
    AdminComponent,
    AnnotationSaveDialogComponent,
    CreateCampaignComponent,
    AdminSnackbarJPEGComponent,
    AdminSnackbarSavedComponent,
    LeaderboardComponent,
    PredictComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatProgressBarModule,
    ApiModule,
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AnnotationSaveDialogComponent, AdminSnackbarJPEGComponent, AdminSnackbarSavedComponent]
})
export class AppModule {}
