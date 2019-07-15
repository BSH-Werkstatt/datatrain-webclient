import { Component, OnInit, Input } from '@angular/core';
import { DefaultService, ImageData, PredictionResult } from '../../../swagger';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bsh-prediction',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  @Input() campaignId: string;

  imageFile: File;
  fileSrc: String;
  predictionResult: PredictionResult;
  uploadInProgress: boolean = false;

  constructor(private defaultService: DefaultService, private _snackBar: MatSnackBar) {}

  ngOnInit() {}

  static fileIsImage(file: File): boolean {
    const filenameParts = file.name.split('.');
    const imageExts = ['jpg', 'jpeg'];
    const ext = filenameParts[filenameParts.length - 1].toLowerCase();

    return imageExts.includes(ext);
  }

  /**
   * Handles the Choose Files input
   */
  onFileSelected() {
    const fileChooser: any = document.getElementById('choose-file');

    // tslint:disable-next-line: prefer-for-of
    const file = fileChooser.files[0];
    if (PredictComponent.fileIsImage(file)) {
      this.imageFile = file;

      this.previewFile(file);
    }

    fileChooser.value = '';
  }

  /**
   * Creates the preview of a file in the upload preview element
   * @param file file to create preview of
   */
  previewFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.fileSrc = reader.result.toString();
    };
  }

  /**
   * Predict stuff
   */
  handlePredictionButton() {
    if (!this.imageFile) {
      this._snackBar.open('No images available for prediction', 'dismiss', {
        duration: 2000
      });
    } else {
      this.uploadInProgress = true;
      try {
        this.defaultService
          .requestPrediction(this.imageFile, this.campaignId)
          .subscribe((predictionResult: PredictionResult) => {
            this.predictionResult = predictionResult;
            this.resetImage();
          });
      } catch (e) {
        this._snackBar.open('There was an error with the prediction. ' + e, 'dismiss', {
          duration: 2000
        });
        this.resetImage();
      }
    }
  }

  resetImage() {
    this.imageFile = undefined;
    this.fileSrc = undefined;
    this.uploadInProgress = false;
  }
}
