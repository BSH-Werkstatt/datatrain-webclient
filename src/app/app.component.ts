import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

import { slideInAnimation } from "./animations/router-animations";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	animations: [
		slideInAnimation
		// animation triggers go here
	]
})
export class AppComponent {
	constructor(private router: Router) {}

	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet &&
			outlet.activatedRouteData &&
			outlet.activatedRouteData["animation"]
		);
	}
}
