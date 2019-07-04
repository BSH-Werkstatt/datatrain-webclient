import { Component } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import { DefaultService, Campaign, Leaderboard, User, LeaderboardScore } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends CampaignComponent {
  newObjectType: string;
  newUserEmail: string;
  userNotFound = false;

  protected leaderboard: Leaderboard;

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService) {
    super(route, router, defaultService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.campaign$.subscribe((campaign: Campaign) => {
      this.defaultService.getLeaderboard(campaign.id).subscribe(leaderboard => {
        this.leaderboard = leaderboard;
      });
    });
  }

  /**
   * Sets the function page name in the navigation bar
   */
  setNavBar() {
    super.setNavBar();

    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.remove('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = 'Administration';
    // @ts-ignore
    navFunctionBtn.href = '/campaigns/' + this.campaign.urlName + '/admin';
  }

  addToTaxonomy() {
    this.campaign.taxonomy.push(this.newObjectType);
    this.newObjectType = '';
  }

  removeFromTaxonomy(i: number) {
    this.campaign.taxonomy.splice(i, 1);
  }

  addToLeaderboard() {
    this.userNotFound = false;
    if (this.newUserEmail && this.newUserEmail.length > 0) {
      this.defaultService.getUserByEmail(this.newUserEmail).subscribe((user: User) => {
        if (user.email === 'ERROR_NOT_FOUND' || user.id === 'ERROR_NOT_FOUND') {
          this.userNotFound = true;
        } else {
          const ls: LeaderboardScore = {
            userId: user.id,
            name: user.name,
            email: user.email,
            score: 0
          };
          this.leaderboard.scores.push(ls);

          this.newUserEmail = '';
        }
      });
    }
  }

  removeFromLeaderboard(i: number) {
    this.leaderboard.scores.splice(i, 1);
  }

  save() {}
}
