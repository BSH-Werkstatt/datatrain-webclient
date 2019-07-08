import { Component, OnInit } from '@angular/core';
import { CampaignComponent } from '../campaign/campaign.component';
import { DefaultService, ImageData, Campaign } from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CanvasAnnotation } from './CanvasAnnotation';

const MAX_ZOOM = 5;
const MIN_ZOOM = 1;
const ZOOM_DELTA = 0.05;

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent extends CampaignComponent {
  protected STATE = {
    IDLE: 0,
    POLYGON: 1,
    FREEHAND: 2
  };

  protected imageId = '';

  protected image;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  protected canvasAnnotations: CanvasAnnotation[] = [];
  protected currentCanvasAnnotationIndex = -1;
  protected state = 0;
  protected canMove = true;

  protected originX = 0;
  protected originY = 0;
  protected offsetX = 0;
  protected offsetY = 0;

  protected mousedown = false;
  protected collision = false;
  protected lastMX: number | null = null;
  protected lastMY: number | null = null;

  protected fitScale = 1;
  protected scale = 1;
  protected zoom = 1;

  protected isRescaling = false;

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
    this.image = new Image();
    this.image.onload = e => {
      this.initCanvas();
    };
    this.image.src = 'http://127.0.0.1:5000/images/' + this.campaign.id + '/' + this.imageId + '.jpg';
  }

  initCanvas() {
    // @ts-ignore
    this.canvas = document.getElementById('mainCanvas');
    // @ts-ignore
    this.ctx = this.canvas.getContext('2d');

    // initialize event listeners
    window.addEventListener(
      'resize',
      () => {
        this.resizeCanvas();
      },
      false
    );

    this.canvas.addEventListener(
      'click',
      e => {
        e.preventDefault();
        this.handleClick(e);
      },
      false
    );
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    this.canvas.addEventListener('mousewheel', this.handleScroll.bind(this), false);
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this), false);

    this.resizeCanvas();

    window.requestAnimationFrame(this.render.bind(this));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 64;
    this.rescale();
  }

  render() {
    this.clear();

    this.drawImage();
    this.drawAnnotations();

    this.drawDebugStuff();
  }

  drawDebugStuff() {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.originX, this.originY, 10 / this.scale, 0, 2 * Math.PI);
    ctx.fill();
  }

  clear() {
    this.ctx.clearRect(this.originX, this.originY, this.canvas.width / this.scale, this.canvas.height / this.scale);
  }

  rescale() {
    if (!this.isRescaling) {
      this.isRescaling = true;
      const widthRatio = this.canvas.width / this.image.width;
      const heightRatio = this.canvas.height / this.image.height;

      this.fitScale = widthRatio < heightRatio ? widthRatio : heightRatio;
      this.scale = this.fitScale * MIN_ZOOM;
      this.zoom = MIN_ZOOM;

      this.offsetX = (this.canvas.width - this.image.width * this.scale) / 2;
      this.offsetY = (this.canvas.height - this.image.height * this.scale) / 2;

      this.originX = -(this.canvas.width / this.scale - this.image.width) / 2;
      this.originY = -(this.canvas.height / this.scale - this.image.height) / 2;

      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);

      this.isRescaling = false;
    }
  }

  drawImage() {
    this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
  }

  createAnnotation() {
    this.canvasAnnotations.push(new CanvasAnnotation(this.canvas, this.ctx));
    this.currentCanvasAnnotationIndex = this.canvasAnnotations.length - 1;
    this.getCurrentAnnotation().selected = true;
  }

  startPolygonAnnotation() {
    this.createAnnotation();
    this.state = this.STATE.POLYGON; // 1 is drawing polygon
  }

  startFreehandAnnotation() {
    this.createAnnotation();
    this.state = this.STATE.FREEHAND; // 1 is drawing polygon
  }

  handleClick(e) {
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);

    switch (this.state) {
      case this.STATE.POLYGON:
        this.statePolygonClick(x, y);
        break;
    }

    window.requestAnimationFrame(this.render.bind(this));
  }

  handleMouseDown(e) {
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);
    this.lastMX = this.getMouseX(e);
    this.lastMY = this.getMouseY(e);

    switch (this.state) {
      case this.STATE.FREEHAND:
        this.stateFreehandClick(x, y);
        break;
    }
    this.mousedown = true;

    window.requestAnimationFrame(this.render.bind(this));
  }

  handleMouseUp(e) {
    this.mousedown = false;
    this.lastMX = null;
    this.lastMY = null;
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);

    switch (this.state) {
      case this.STATE.FREEHAND:
        if (!this.canMove) {
          this.getCurrentAnnotation().stopFreehand(x, y, this.scale);
          this.getCurrentAnnotation().selected = false;
        }
        break;
    }

    window.requestAnimationFrame(this.render.bind(this));
  }

  handleScroll(e) {
    const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;

    if (delta) {
      this.handleZoom(delta, e);
    }

    window.requestAnimationFrame(this.render.bind(this));
    return e.preventDefault() && false;
  }

  handleMousemove(e) {
    const mx = this.getMouseX(e);
    const my = this.getMouseY(e);
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);

    if (this.lastMX == null || this.lastMY == null) {
      this.lastMX = mx;
      this.lastMY = my;
    }

    switch (this.state) {
      case this.STATE.FREEHAND:
        // freehand logic
        if (this.mousedown && !this.canMove) {
          const completed = this.getCurrentAnnotation().updateFreehand(x, y, this.scale);

          if (completed) {
            this.state = this.STATE.IDLE;
            this.getCurrentAnnotation().selected = false;
            this.canMove = true;
          }
        }
        break;
    }

    if (!this.collision && this.mousedown) {
      // move picture
      this.handleMove(mx, my);
    }

    this.lastMX = mx;
    this.lastMY = my;
    window.requestAnimationFrame(this.render.bind(this));
  }

  getMaxScale() {
    return this.fitScale * MAX_ZOOM;
  }

  getMinScale() {
    return this.fitScale * MIN_ZOOM;
  }

  handleZoom(delta: number, e) {
    const mx = this.getMouseX(e);
    const my = this.getMouseY(e);

    const factor = delta > 0 ? 1 + ZOOM_DELTA : 1 - ZOOM_DELTA;
    if (this.scale * factor < this.getMinScale() || this.scale * factor > this.getMaxScale()) {
      return;
    }

    const tx = mx / this.scale + this.originX - mx / (this.scale * factor);
    const ty = my / this.scale + this.originY - my / (this.scale * factor);
    this.scale *= factor;
    this.zoom *= factor;

    this.ctx.translate(this.originX, this.originY);
    this.ctx.scale(factor, factor);
    this.ctx.translate(-tx, -ty);

    this.originX = tx;
    this.originY = ty;
  }

  handleMove(x, y) {
    if (!this.canMove) {
      return;
    }

    const dx = (x - this.lastMX) / this.scale;
    const dy = (y - this.lastMY) / this.scale;

    this.offsetX += dx;
    this.offsetY += dy;

    this.ctx.translate(dx, dy);

    this.originX -= dx;
    this.originY -= dy;
  }

  getCurrentAnnotation() {
    return this.canvasAnnotations[this.currentCanvasAnnotationIndex];
  }

  statePolygonClick(x, y) {
    const completed = this.getCurrentAnnotation().addPoint(x, y, this.scale);

    if (completed) {
      this.state = this.STATE.IDLE;
      this.getCurrentAnnotation().selected = false;
    }
  }

  stateFreehandClick(x, y) {
    const ci = this.getCurrentAnnotation();
    ci.selected = true;
    if (ci.points.length === 0) {
      ci.addPoint(x, y, this.scale);
      this.canMove = false;
    } else if (ci.detectCollision(x, y, this.scale) == ci.points.length - 1) {
      // detect collision and start freehand if collided with last point
      this.canMove = false;
    }
  }

  drawAnnotations() {
    this.canvasAnnotations.forEach(a => {
      a.draw(this.scale);
    });
  }

  getMouseToImageX(e) {
    const cx = e.clientX;
    const mx = (cx - this.canvas.offsetLeft) / this.scale + this.originX;

    return mx;
  }

  getMouseToImageY(e) {
    const cy = e.clientY;
    const my = (cy - this.canvas.offsetTop) / this.scale + this.originY;

    return my;
  }

  getMouseX(e) {
    return e.clientX - this.canvas.offsetLeft;
  }

  getMouseY(e) {
    return e.clientY - this.canvas.offsetTop;
  }
}
