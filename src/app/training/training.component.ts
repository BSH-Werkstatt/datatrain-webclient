import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DefaultService, Training, TrainingCreationRequest } from '../../swagger';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  @Input() campaignId: string;
  training: Training = null;
  progress = 0;

  /* Metrics table */
  displayedColumns: string[] = ['number', 'message'];
  dataSource = new MatTableDataSource<string>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private defaultService: DefaultService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.loadNewTrainingData();
    setInterval(() => {
      this.loadNewTrainingData();
    }, 10 * 1000);
  }

  loadNewTrainingData() {
    this.defaultService.getActiveTraining(this.campaignId).subscribe((training: Training) => {
      if (training != null) {
        this.training = training;

        this.dataSource.data = this.training.metrics.map(s => s.replace(/\t/g, '\n').trim()).reverse();
        this.progress = Math.round(
          100 *
            ((training.currentEpoch - 1) / training.epochs + training.currentStep / training.steps / training.epochs)
        );
      }
    });
  }

  triggerTraining() {
    if ((this.training && this.training.finished) || this.training == null) {
      const training: Training = {
        id: '', // will be completed by server
        campaignId: this.campaignId,
        timeStart: '', // will be completed by server
        currentEpoch: 0,
        epochs: 5, // default value
        currentStep: 0,
        steps: 100, // default value
        metrics: [],
        finished: false
      };

      this.training = training;
      const request: TrainingCreationRequest = {
        userToken: localStorage.getItem('datatrainUserToken'),
        training
      };

      this.defaultService.postTraining(this.campaignId, request).subscribe((trainingResult: Training) => {
        this.training = trainingResult;
        this.loadNewTrainingData();
      });
    }
  }
}
