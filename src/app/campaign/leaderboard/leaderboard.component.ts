import { Component, OnInit, Input } from '@angular/core';

import { DefaultService, Leaderboard } from '../../../swagger';

@Component({
  selector: 'bsh-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() campaignId: string;

  protected leaderboard: Leaderboard;
  protected leaderboardLoaded = false;

  constructor(protected defaultService: DefaultService) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  /**
   * Loads the leaderboard using the Swagger DefaultService
   */
  loadLeaderboard() {
    this.defaultService.getLeaderboard(this.campaignId).subscribe((leaderboard: Leaderboard) => {
      this.leaderboard = leaderboard;
      this.leaderboard.scores.sort((a, b) => {
        return b.score - a.score;
      });
      this.leaderboardLoaded = true;
    });
  }
}
