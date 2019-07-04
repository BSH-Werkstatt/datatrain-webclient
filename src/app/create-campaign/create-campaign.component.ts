import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { DefaultService, Campaign, Leaderboard, User, LeaderboardScore } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignComponent } from '../campaign/campaign.component';

@Component({
  selector: 'app-create-campaign',
  templateUrl: '../admin/admin.component.html',
  styleUrls: ['../admin/admin.component.scss']
})
export class CreateCampaignComponent extends AdminComponent {
  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService) {
    super(route, router, defaultService);

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

  ngOnInit() {}
}
