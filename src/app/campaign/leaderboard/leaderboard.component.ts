import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { MatPaginator, MatTableDataSource } from '@angular/material';

import { DefaultService, Leaderboard, User, LeaderboardScore } from '../../../swagger';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() campaignId: string;

  protected leaderboard: Leaderboard;
  protected leaderboardLoaded = false;
  user: User;

  displayedColumns: string[] = ['position', 'name', 'score'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(protected defaultService: DefaultService) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('datatrainUser'));
    this.loadLeaderboard();
    console.log(this.user);
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
