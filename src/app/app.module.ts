import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import {
	MatButtonModule,
	MatCardModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatSnackBarModule,
	MatToolbarModule
} from "@angular/material";

import { FormsModule } from "@angular/forms";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { StartComponent } from "./start/start.component";
import { AppRoutingModule } from "./app-routing.module";
import { RegisterComponent } from "./register/register.component";
import { CampaignComponent } from "./campaign/campaign.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		StartComponent,
		RegisterComponent,
		CampaignComponent
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
		MatToolbarModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
