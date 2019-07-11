import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampaignComponent } from '../campaign/campaign.component';
import {
  DefaultService,
  ImageData,
  Campaign,
  AnnotationCreationRequest,
  AnnotationCreationRequestItem
} from '../../swagger';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CanvasAnnotation } from './CanvasAnnotation';

const MAX_ZOOM = 5;
const MIN_ZOOM = 1;
const ZOOM_DELTA = 0.05;

@Component({
  selector: 'app-annotation-save-dialog',
  templateUrl: './annotation-save-dialog.component.html'
})
export class AnnotationSaveDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnnotationSaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { campaign: Campaign }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent extends CampaignComponent implements OnInit {
  protected STATE = {
    IDLE: 0,
    POLYGON: 1,
    FREEHAND: 2
  };

  protected imageId = '';

  protected image;
  protected imageLoaded = false;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  protected canvasAnnotations: CanvasAnnotation[] = [];
  protected currentCanvasAnnotationIndex = -1;
  protected state = 0;
  protected canMove = true;

  protected redoStack: CanvasAnnotation[][] = [];
  protected undoStack: CanvasAnnotation[][] = [];

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

  protected showSelectLabel = false;
  protected labelSource = 0; // 0 == taxonomy, 1 == other
  protected otherLabelValue: string;
  protected taxnonomyChosen = -1;

  constructor(route: ActivatedRoute, router: Router, defaultService: DefaultService, public dialog: MatDialog) {
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
    this.canvasAnnotations = [];
    this.currentCanvasAnnotationIndex = -1;
    this.state = this.STATE.IDLE;
    this.canMove = true;

    this.undoStack = [];
    this.redoStack = [];

    this.labelSource = 0;
    this.otherLabelValue = '';
    this.taxnonomyChosen = -1;

    this.imageLoaded = false;

    this.image = new Image();
    this.image.onload = e => {
      this.imageLoaded = true;
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

    this.canvas.addEventListener(
      'touchstart',
      e => {
        e = this.touchToMouseEvent(e);
        this.handleMouseDown(e);
      },
      false
    );
    this.canvas.addEventListener(
      'touchend',
      e => {
        e = this.touchToMouseEvent(e);
        this.handleMouseUp(e);
      },
      false
    );
    this.canvas.addEventListener(
      'touchcancel',
      e => {
        e = this.touchToMouseEvent(e);
        this.handleMouseUp(e);
      },
      false
    );
    this.canvas.addEventListener(
      'touchmove',
      e => {
        e = this.touchToMouseEvent(e);
        this.handleMousemove(e);
      },
      false
    );

    this.resizeCanvas();

    this.requestFrame();
  }

  touchToMouseEvent(e) {
    // @ts-ignore
    e.button = 0;
    // @ts-ignore
    if (e.touches.length > 0) {
      e.clientX = e.touches[0].clientX;
      // @ts-ignore
      e.clientY = e.touches[0].clientY;
    } else {
      e.clientX = undefined;
      // @ts-ignore
      e.clientY = undefined;
    }

    return e;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 64;
    this.rescale();

    this.requestFrame();
  }

  render() {
    this.clear();

    this.drawImage();
    this.drawAnnotations();

    this.drawDebugStuff();
  }

  requestFrame() {
    window.requestAnimationFrame(this.render.bind(this));
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

  unselectAll() {
    for (const ca of this.canvasAnnotations) {
      ca.selected = false;
    }
  }
  createAnnotation() {
    this.unselectAll();

    this.canvasAnnotations.push(new CanvasAnnotation(this.canvas, this.ctx));
    this.currentCanvasAnnotationIndex = this.canvasAnnotations.length - 1;
    this.getCurrentAnnotation().selected = true;
  }

  startPolygonAnnotation() {
    this.saveToUndoStack();

    this.createAnnotation();
    this.state = this.STATE.POLYGON; // 1 is drawing polygon
  }

  startFreehandAnnotation() {
    this.saveToUndoStack();

    this.createAnnotation();
    this.state = this.STATE.FREEHAND; // 1 is drawing polygon
  }

  handleClick(e) {
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);

    if (e.button === 0) {
      switch (this.state) {
        case this.STATE.IDLE:
          this.currentCanvasAnnotationIndex = -1;

          this.unselectAll();
          for (let i = 0; i < this.canvasAnnotations.length; i++) {
            const ca = this.canvasAnnotations[i];
            if (ca.pointInside(x, y)) {
              ca.selected = true;
              this.currentCanvasAnnotationIndex = i;
              break;
            }
          }
          break;
        case this.STATE.POLYGON:
          this.statePolygonClick(x, y);
          break;
      }
    }

    this.requestFrame();
  }

  handleMouseDown(e) {
    const x = this.getMouseToImageX(e);
    const y = this.getMouseToImageY(e);
    this.lastMX = this.getMouseX(e);
    this.lastMY = this.getMouseY(e);

    if (e.button === 0) {
      // left
      switch (this.state) {
        case this.STATE.FREEHAND:
          this.stateFreehandClick(x, y);
          break;
      }
      this.mousedown = true;
    } else if (e.button === 1) {
      // middle
      this.mousedown = true;
      this.canMove = true;
    }

    this.requestFrame();
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
          this.canMove = true;
        }
        break;
    }

    this.requestFrame();
  }

  handleScroll(e) {
    const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;

    if (delta) {
      this.handleZoom(delta, e);
    }

    this.requestFrame();
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

            this.initLabelling();
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
    this.requestFrame();
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

      this.initLabelling();
    }
  }

  stateFreehandClick(x, y) {
    const ci = this.getCurrentAnnotation();
    ci.selected = true;

    if (ci.points.length === 0) {
      ci.addPoint(x, y, this.scale);
      this.canMove = false;
    } else if (ci.detectPointCollision(x, y, this.scale) === ci.points.length - 1) {
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

    if (mx < 0) {
      return 0;
    } else if (mx > this.image.width) {
      return this.image.width;
    }

    return mx;
  }

  getMouseToImageY(e) {
    const cy = e.clientY;
    const my = (cy - this.canvas.offsetTop) / this.scale + this.originY;

    if (my < 0) {
      return 0;
    } else if (my > this.image.height) {
      return this.image.height;
    }

    return my;
  }

  getMouseX(e) {
    return e.clientX - this.canvas.offsetLeft;
  }

  getMouseY(e) {
    return e.clientY - this.canvas.offsetTop;
  }

  deleteAnnotation() {
    this.saveToUndoStack();

    this.canvasAnnotations.splice(this.currentCanvasAnnotationIndex, 1);
    this.currentCanvasAnnotationIndex = -1;
    this.state = this.STATE.IDLE;

    this.requestFrame();
  }

  deleteAllAnnotations() {
    this.saveToUndoStack();

    this.canvasAnnotations = [];
    this.currentCanvasAnnotationIndex = -1;
    this.state = this.STATE.IDLE;

    this.requestFrame();
  }

  initLabelling() {
    this.labelSource = 0;
    this.mousedown = false;

    this.showSelectLabel = true;
  }

  tabLabelTaxonomy() {
    this.labelSource = 0;
  }

  tabLabelOther() {
    this.labelSource = 1;
  }

  chooseLabel(i) {
    this.taxnonomyChosen = i;
  }

  selectLabel() {
    const labelValue = this.labelSource === 0 ? this.campaign.taxonomy[this.taxnonomyChosen] : this.otherLabelValue;
    if (this.labelSource === 1 && labelValue.length === 0) {
      // TODO: alert label value cannot be empty
      return;
    }

    this.getCurrentAnnotation().setLabel(labelValue);

    this.showSelectLabel = false;
    this.getCurrentAnnotation().selected = false;
    this.currentCanvasAnnotationIndex = -1;

    this.otherLabelValue = '';
    this.taxnonomyChosen = -1;

    this.requestFrame();
  }

  selectLabelDelete() {
    this.canvasAnnotations.splice(this.canvasAnnotations.length - 1, 1);
    this.currentCanvasAnnotationIndex = -1;
    this.state = this.STATE.IDLE;
    this.showSelectLabel = false;
    this.otherLabelValue = '';
    this.taxnonomyChosen = -1;

    this.requestFrame();
  }

  saveToUndoStack() {
    this.redoStack = [];
    this.undoStack.push([...this.canvasAnnotations]);

    if (this.undoStack.length > 50) {
      this.undoStack.splice(0, 1);
    }
  }

  saveToRedoStack() {
    this.redoStack.push([...this.canvasAnnotations]);

    if (this.redoStack.length > 50) {
      this.redoStack.splice(0, 1);
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.saveToRedoStack();

      const undoState = this.undoStack[this.undoStack.length - 1];
      this.canvasAnnotations = undoState;
      this.undoStack.splice(-1, 1);
    }

    this.requestFrame();
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push([...this.canvasAnnotations]);
      const redoState = this.redoStack[this.redoStack.length - 1];
      this.canvasAnnotations = redoState;
      this.redoStack.splice(-1, 1);
    }

    this.requestFrame();
  }

  save() {
    const annotations: AnnotationCreationRequestItem[] = [];

    this.canvasAnnotations.forEach(a => {
      annotations.push(a.toAnnotationCreationRequestItem(this.campaign.id, this.imageId));
    });

    const ar: AnnotationCreationRequest = {
      items: annotations,
      userToken: localStorage.getItem('datatrainUserToken')
    };

    this.defaultService.postImageAnnotation(this.campaign.id, this.imageId, ar).subscribe(response => {
      this.openSubmitDialog();
    });
  }

  openSubmitDialog(): void {
    const dialogRef = this.dialog.open(AnnotationSaveDialogComponent, {
      width: '300px',
      data: { campaign: this.campaign }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.router.navigateByUrl('/campaigns/' + this.campaign.urlName);
      } else {
        this.clear();
        this.determineImageId();
      }
    });
  }
}
