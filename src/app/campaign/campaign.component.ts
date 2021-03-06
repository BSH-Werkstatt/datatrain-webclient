import { Component, OnInit } from '@angular/core';
import { DefaultService, Campaign } from '../../swagger';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss', '../upload/upload.component.scss']
})
export class CampaignComponent implements OnInit {
  public urlName = '';

  protected canEditCampaign = false;

  protected campaign: Campaign;
  protected campaign$: Observable<Campaign>;
  userToken: string;
  campaignLoaded = false;

  constructor(protected route: ActivatedRoute, protected router: Router, protected defaultService: DefaultService) {
    this.userToken = localStorage.getItem('datatrainUserToken');
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('datatrainUser'));

    if (!user) {
      this.router.navigateByUrl('/');
    } else {
      this.campaign$ = this.route.paramMap.pipe(
        switchMap(params => {
          const urlName = params.get('urlName');
          this.urlName = urlName;

          return this.defaultService.getCampaignByURLName(urlName);
        })
      );

      this.campaign$.subscribe((campaign: Campaign) => {
        this.campaign = campaign;
        this.campaignLoaded = true;

        this.setNavBar();
      });

      if (user.userType === 'admin' || user.userType === 'campaign_owner') {
        this.canEditCampaign = true;
      }
    }
  }

  /**
   * Sets the campaign name in the navigation bar
   */
  setNavBar() {
    const navCampaignSlash = document.getElementById('nav-campaign-slash');
    navCampaignSlash.classList.remove('nav-hidden');

    const navCampaignBtn = document.getElementById('nav-campaign-btn');
    navCampaignBtn.innerHTML = this.campaign.name;
    // @ts-ignore
    navCampaignBtn.href = '/campaigns/' + this.campaign.urlName;

    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.add('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = '';
  }
}
