import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { 
	MatFormFieldModule,
	MatInputModule,
} from  '@angular/material';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from './login/login.component';
import { StartComponent } from './start/start.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
	declarations: [AppComponent, LoginComponent, StartComponent, RegisterComponent],
	imports: [
		BrowserModule,
		MatCardModule,
		BrowserAnimationsModule,
		MatGridListModule,
		MatButtonModule,
		MatSnackBarModule,
		AppRoutingModule,
		MatInputModule,
		MatFormFieldModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
