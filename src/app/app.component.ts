import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { slideInAnimation } from './animations/router-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class AppComponent {
  router;
  constructor(router: Router) {
    this.router = router;
  }

  prepareRoute(outlet: RouterOutlet) {
    /* tslint:disable:no-string-literal */
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    /* tslint:enable:no-string-literal */
  }
}
