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
export class CreateCampaignComponent extends AdminComponent {
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
    this.campaign.name = this.campaignName;
    this.campaign.description = this.campaignDescription;
    if (this.campaignImageNewAWSSrc) {
      this.campaign.image = this.campaignImageNewAWSSrc;
    }

    // @ts-ignore
    const requestCampaign: CampaignCreationRequest = this.campaign;
    requestCampaign.userToken = this.campaign.ownerId;

    if (!this.campaignImageFilePreviewSrc || this.leaderboard.scores.length <= 0) {
      alert('Please choose an image and add at least one object class to the taxonomy!');
      return;
    }

    this.defaultService.postCampaign(requestCampaign).subscribe(campaign => {
      const requestLeaderboard: LeaderboardCreationRequest = {
        userToken: localStorage.getItem('datatrainUserToken'),
        campaignId: campaign.id,
        scores: this.leaderboard.scores
      };

      this.defaultService.postLeaderboard(campaign.id, requestLeaderboard).subscribe(leaderboard => {
        this.uploading = true;
        this.leaderboard = leaderboard;

        this.defaultService
          .postCampaignImage(this.campaignImageFile, localStorage.getItem('datatrainUserToken'), campaign.id)
          .subscribe(url => {
            this.campaignImageNewAWSSrc = url;
            this.uploading = false;

            this.campaign = campaign;
            this.campaign.image = url;

            super.save();

            setTimeout(() => {
              this.router.navigateByUrl('/campaigns');
            }, 1000);
          });
      });
    });
  }
}
