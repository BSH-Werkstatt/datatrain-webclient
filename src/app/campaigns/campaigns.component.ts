import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultService, Campaign } from '../../swagger';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})

/**
 * The Start component
 */
export class CampaignsComponent implements OnInit {
  campaigns: Campaign[];

  /**
   * Constructor
   */
  constructor(private router: Router, private defaultService: DefaultService) {}

  /**
   * Execute on controller initialization
   */
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('datatrainUser'));

    if (!user) {
      this.router.navigateByUrl('/');
    } else {
      this.defaultService.getAllCampaigns().subscribe((campaigns: Campaign[]) => {
        this.campaigns = campaigns;
      });
      if (user.userType === 'admin' || user.userType === 'campaign_owner') {
        document.getElementById('create-campaign-btn').classList.remove('nav-hidden');
      }
    }
  }
}
