import { Component, OnInit } from '@angular/core';
import { AdminComponent, AdminSnackbarSavedComponent } from '../admin/admin.component';
import {
  DefaultService,
  Campaign,
  Leaderboard,
  User,
  LeaderboardScore,
  CampaignCreationRequest,
  LeaderboardCreationRequest
} from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignComponent } from '../campaign/campaign.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-campaign',
  templateUrl: '../admin/admin.component.html',
  styleUrls: ['../admin/admin.component.scss']
})
export class CreateCampaignComponent extends AdminComponent implements OnInit {
  usersfooed = false;

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService, snackBar: MatSnackBar) {
    super(route, router, defaultService, snackBar);

    this.hideImageButtons = true;

    this.campaign = {
      id: '',
      ownerId: localStorage.getItem('datatrainUserToken'),
      type: '0',
      name: 'New machine learning project',
      urlName: '',
      description: 'Please write a concise description of the aim of the campaign.',
      taxonomy: [],
      image: ''
    };

    this.leaderboard = {
      id: '',
      campaignId: '',
      scores: []
    };

    this.campaignLoaded = true;
  }

  ngOnInit() {
    this.campaignName = this.campaign.name;
    this.campaignDescription = this.campaign.description;

    this.setNavBar();
  }

  setNavBar() {
    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.remove('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = 'Create';
    // @ts-ignore
    navFunctionBtn.href = '/campaigns/' + this.campaign.urlName + '/create';
  }

  save() {
    this.snackBar.openFromComponent(AdminSnackbarSavedComponent, {
      duration: 3 * 1000
    });

    setTimeout(() => {
      this.router.navigateByUrl('/campaigns');
    }, 1000);
  }

  foo() {
    if (this.usersfooed) {
      return;
    }
    const users = [
      'taylor.lei@tum.de',
      'emil.oldenburg@tum.de',
      'susanne.winkler@tum.de',
      'baris.sen@tum.de',
      'borja-sanchez.clemente@tum.de',
      'natalia.shohina@tum.de'
    ];

    users.forEach(email => {
      this.defaultService.getUserByEmail(email).subscribe((user: User) => {
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
    });
    this.usersfooed = true;
  }
}
