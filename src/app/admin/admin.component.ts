import { Component, OnInit } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import {
  DefaultService,
  Campaign,
  Leaderboard,
  User,
  LeaderboardScore,
  CampaignUpdateRequest,
  LeaderboardUpdateRequest
} from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UploadComponent } from '../upload/upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-jpeg-snackbar',
  template: '<span>Please upload a JPEG file.</span>'
})
export class AdminSnackbarJPEGComponent {}

@Component({
  selector: 'app-admin-saved-snackbar',
  template: '<span>Your updates have been saved successfully!</span>'
})
export class AdminSnackbarSavedComponent {}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends CampaignComponent implements OnInit {
  newObjectType: string;
  newUserEmail: string;
  userNotFound = false;

  hideImageButtons = false;
  campaignName: string;
  campaignDescription: string;

  campaignImageFile: File;
  campaignImageFilePreviewSrc: string;
  campaignImageNewAWSSrc: string;
  uploading = false;

  leaderboard: Leaderboard;

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService, protected snackBar: MatSnackBar) {
    super(route, router, defaultService);

    this.campaign = {
      id: '',
      ownerId: localStorage.getItem('datatrainUserToken'),
      type: '0',
      name: 'Campaign',
      urlName: '',
      description: 'Please write a concise description of the aim of the campaign.',
      taxonomy: [],
      image: ''
    };

    this.leaderboard = {
      id: '',
      scores: [],
      campaignId: ''
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.campaign$.subscribe((campaign: Campaign) => {
      this.campaignName = campaign.name;
      this.campaignDescription = campaign.description;

      this.defaultService.getLeaderboard(campaign.id).subscribe(leaderboard => {
        this.leaderboard = leaderboard;
      });
    });
  }

  /**
   * Sets the function page name in the navigation bar
   */
  setNavBar() {
    super.setNavBar();

    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.remove('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = 'Administration';
    // @ts-ignore
    navFunctionBtn.href = '/campaigns/' + this.campaign.urlName + '/admin';
  }

  addToTaxonomy() {
    this.campaign.taxonomy.push(this.newObjectType);
    this.newObjectType = '';
  }

  removeFromTaxonomy(i: number) {
    this.campaign.taxonomy.splice(i, 1);
  }

  addToLeaderboard() {
    this.userNotFound = false;
    if (this.newUserEmail && this.newUserEmail.length > 0) {
      this.defaultService.getUserByEmail(this.newUserEmail).subscribe((user: User) => {
        if (user.email === 'ERROR_NOT_FOUND' || user.id === 'ERROR_NOT_FOUND') {
          this.userNotFound = true;
        } else {
          const ls: LeaderboardScore = {
            userId: user.id,
            name: user.name,
            email: user.email,
            score: 0
          };
          this.leaderboard.scores.push(ls);

          this.newUserEmail = '';
        }
      });
    }
  }

  removeFromLeaderboard(i: number) {
    this.leaderboard.scores.splice(i, 1);
  }

  save() {
    this.campaign.name = this.campaignName;
    this.campaign.description = this.campaignDescription;
    if (this.campaignImageNewAWSSrc) {
      this.campaign.image = this.campaignImageNewAWSSrc;
    }

    const requestCampaign: CampaignUpdateRequest = {
      campaign: this.campaign,
      userToken: localStorage.getItem('datatrainUserToken')
    };

    if (this.leaderboard.scores.length <= 0) {
      alert('Please add at least one object class to the taxonomy!');
      return;
    }

    this.defaultService.putCampaign(this.campaign.id, requestCampaign).subscribe(campaign => {
      const requestLeaderboard: LeaderboardUpdateRequest = {
        userToken: localStorage.getItem('datatrainUserToken'),
        leaderboard: this.leaderboard
      };
      this.defaultService.putLeaderboard(this.campaign.id, requestLeaderboard).subscribe(leaderboard => {
        this.snackBar.openFromComponent(AdminSnackbarSavedComponent, {
          duration: 3 * 1000
        });
      });
    });
  }

  /**
   * Handles the Choose Files input
   */
  onFileSelected() {
    const fileChooser: any = document.getElementById('choose-file');

    // tslint:disable-next-line: prefer-for-of
    const file = fileChooser.files[0];
    if (UploadComponent.fileIsImage(file)) {
      this.campaignImageFile = file;

      this.previewFile();
    } else {
      this.snackBar.openFromComponent(AdminSnackbarJPEGComponent, {
        duration: 3 * 1000
      });
    }
  }

  /**
   * Creates the preview of a file in the upload preview element
   */
  previewFile() {
    const reader = new FileReader();
    reader.readAsDataURL(this.campaignImageFile);
    reader.onloadend = () => {
      if (document.getElementById('upload-btn')) {
        document.getElementById('upload-btn').removeAttribute('disabled');
      }

      this.campaignImageFilePreviewSrc = reader.result.toString();
    };
  }

  /**
   * Uploads the new campaign image and sets campaignImageNewAWSSrc to the returned url
   */
  uploadCampaignImage() {
    this.uploading = true;
    this.defaultService
      .postCampaignImage(this.campaignImageFile, localStorage.getItem('datatrainUserToken'), this.campaign.id)
      .subscribe(url => {
        this.campaignImageNewAWSSrc = url;
        this.uploading = false;
      });
  }

  /**
   * resets changes to the campaign image
   */
  revertCampaignImage() {
    this.campaignImageNewAWSSrc = '';
    this.campaignImageFile = null;
    this.campaignImageFilePreviewSrc = '';
  }

  foo() {}
}
