import { Component, OnInit } from '@angular/core';
import { DefaultService, Campaign } from '../../swagger';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  private campaign: Campaign;
  private campaign$: Observable<Campaign>;
  private campaignLoaded = false;

  constructor(private route: ActivatedRoute, private router: Router, private defaultService: DefaultService) {}

  ngOnInit(): void {
    this.campaign$ = this.route.paramMap.pipe(
      switchMap(params => {
        const urlName = params.get('urlName');

        return this.defaultService.getCampaignByURLName(urlName);
      })
    );

    this.campaign$.subscribe((campaign: Campaign) => {
      this.campaign = campaign;
      this.campaignLoaded = true;

      const navCampaignSlash = document.getElementById('nav-campaign-slash');
      navCampaignSlash.classList.remove('nav-hidden');

      const navCampaignBtn = document.getElementById('nav-campaign-btn');
      navCampaignBtn.innerHTML = campaign.name;
      // @ts-ignore
      navCampaignBtn.href = '/campaigns/' + campaign.urlName;
    });
  }
}
