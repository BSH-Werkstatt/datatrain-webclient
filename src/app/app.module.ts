import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule } from '@angular/forms';

import { ApiModule } from '../swagger/api.module';

import { AdminComponent, AdminSnackbarJPEGComponent, AdminSnackbarSavedComponent } from './admin/admin.component';
import { AnnotationComponent, AnnotationSaveDialogComponent } from './annotation/annotation.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { HistoryComponent } from './history/history.component';
import { LeaderboardComponent } from './campaign/leaderboard/leaderboard.component';
import { LoginComponent } from './login/login.component';
import { PredictComponent } from './campaign/predict/predict.component';
import { RegisterComponent } from './register/register.component';
import { UploadComponent } from './upload/upload.component';
import { TrainingComponent } from './training/training.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminSnackbarJPEGComponent,
    AdminSnackbarSavedComponent,
    AnnotationComponent,
    AnnotationSaveDialogComponent,
    AppComponent,
    CampaignComponent,
    CampaignsComponent,
    CreateCampaignComponent,
    HistoryComponent,
    LeaderboardComponent,
    LoginComponent,
    PredictComponent,
    RegisterComponent,
    UploadComponent,
    TrainingComponent
  ],
  imports: [
    ApiModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AnnotationSaveDialogComponent, AdminSnackbarJPEGComponent, AdminSnackbarSavedComponent]
})
export class AppModule {}
