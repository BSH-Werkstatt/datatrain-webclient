import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultService, Campaign } from '../../swagger';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})

/**
 * The Start component
 */
export class StartComponent implements OnInit {
  private campaigns: Campaign[];

  /**
   * Constructor
   */
  constructor(private router: Router, private defaultService: DefaultService) {}

  /**
   * Execute on controller initialization
   */
  ngOnInit(): void {
    this.defaultService.getAllCampaigns().subscribe((campaigns: Campaign[]) => {
      console.log(campaigns);
      this.campaigns = campaigns;
    });
  }
}
