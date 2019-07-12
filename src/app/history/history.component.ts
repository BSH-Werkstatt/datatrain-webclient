import { Component, OnInit } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import { DefaultService, ImageData, Campaign } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends CampaignComponent implements OnInit {
  images: ImageData[] = [];
  detail: ImageData = null;
  showDetailIndicator = false;
  baseURL = 'https://api.datatrain.rocks';

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService) {
    super(route, router, defaultService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.campaign$.subscribe((campaign: Campaign) => {
      this.defaultService.getAllImages(campaign.id).subscribe((images: ImageData[]) => {
        this.setUserImages(images);
      });
    });
  }

  /**
   * TODO: implement this on backend
   * Picks out the images and the annotations of the user out of all images of the campaign
   * @param images images of the campaign
   */
  setUserImages(images) {
    const userToken = localStorage.getItem('datatrainUserToken');

    const userImages: ImageData[] = [];

    images.forEach(image => {
      const userAnnotations = [];

      image.annotations.forEach(annotation => {
        if (userToken === annotation.id) {
          userAnnotations.push(annotation);
        }
      });

      if (image.userId === userToken || userAnnotations.length > 0) {
        userImages.push(image);
      }

      image.annotations = userAnnotations;
    });

    this.images = userImages;
  }

  /**
   * Shows the ith image in detail
   * @param i ith image
   */
  showDetail(i: number) {
    this.detail = this.images[i];
    this.showDetailIndicator = true;
  }
}
