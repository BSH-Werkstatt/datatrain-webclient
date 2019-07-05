import { Component, OnInit } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import { DefaultService, ImageData, Campaign } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent extends CampaignComponent {
  protected imageId = '';

  protected image;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  protected originX = 0;
  protected originY = 0;
  protected scale = 1;
  protected isRescaling = false;
  protected offsetX = 0;
  protected offsetY = 0;

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService) {
    super(route, router, defaultService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.determineImageId();
  }

  /**
   * Sets the function page name in the navigation bar
   */
  setNavBar() {
    super.setNavBar();

    const navFunctionSlash = document.getElementById('nav-function-slash');
    navFunctionSlash.classList.remove('nav-hidden');

    const navFunctionBtn = document.getElementById('nav-function-btn');
    navFunctionBtn.innerHTML = 'Annotate';
    // @ts-ignore
    navFunctionBtn.href = '/campaigns/' + this.campaign.urlName + '/annotate';
  }

  determineImageId() {
    const toAnnotate = localStorage.getItem('datatrainToAnnotate');

    if (!toAnnotate) {
      this.getRandomImage();
    } else {
      try {
        const imageData = JSON.parse(toAnnotate);
        if (imageData.length < 1 || !imageData[0].id) {
          this.getRandomImage();
        } else {
          this.imageId = imageData[0].id;

          imageData.splice(0, 1);
          localStorage.setItem('datatrainToAnnotate', JSON.stringify(imageData));

          this.init();
        }
      } catch (e) {
        this.getRandomImage();
      }
    }
  }

  getRandomImage() {
    this.campaign$.subscribe((campaign: Campaign) => {
      this.defaultService.getRandomImage(campaign.id).subscribe(
        (imageData: ImageData) => {
          if (imageData) {
            this.imageId = imageData.id;
            this.init();
          } else {
            this.noImage();
          }
        },
        err => {
          console.error('Error getting random image', err);
          this.noImage();
        }
      );
    });
  }

  noImage() {}

  init() {
    console.log(this.imageId);

    this.image = new Image();
    this.image.onload = e => {
      console.log(e);
      this.initCanvas();
    };
    this.image.src = 'http://127.0.0.1:5000/images/' + this.campaign.id + '/' + this.imageId + '.jpg';
  }

  initCanvas() {
    // @ts-ignore
    this.canvas = document.getElementById('mainCanvas');
    // @ts-ignore
    this.ctx = this.canvas.getContext('2d');

    window.addEventListener(
      'resize',
      () => {
        this.resizeCanvas();
      },
      false
    );

    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 64;

    this.render();
  }

  render() {
    this.clear();

    this.rescale();
    this.drawImage();
  }

  clear() {
    this.ctx.clearRect(
      -this.originX / this.scale,
      -this.originY / this.scale,
      (this.canvas.width + 2 * this.originX) / this.scale,
      (this.canvas.height + 2 * this.originY) / this.scale
    );
  }

  rescale() {
    if (!this.isRescaling) {
      this.isRescaling = true;
      const widthRatio = this.canvas.width / this.image.width;
      const heightRatio = this.canvas.height / this.image.height;

      this.scale = widthRatio < heightRatio ? widthRatio : heightRatio;

      this.originX = (this.canvas.width - this.image.width * this.scale) / 2;
      this.originY = (this.canvas.height - this.image.height * this.scale) / 2;

      this.ctx.translate(this.originX, this.originY);
      this.ctx.scale(this.scale, this.scale);

      this.isRescaling = false;
    }
  }

  drawImage() {
    this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
  }
}
