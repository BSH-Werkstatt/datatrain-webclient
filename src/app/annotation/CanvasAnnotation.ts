export class CAPoint {
  public x: number;
  public y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const FREEHAND_DELTA = 30;
const POINT_RADIUS = 8;

export class CanvasAnnotation {
  public points: CAPoint[] = [];
  protected freehandPoint: CAPoint | null = null;

  protected completed = false;
  public selected = false;

  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  draw(scale: number) {
    const ctx = this.ctx;
    ctx.fillStyle = this.selected ? 'rgba(100, 52, 92, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = this.selected ? '#ff20db' : '#ccc';
    ctx.lineWidth = 5 / scale;

    if (this.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }

      if (this.freehandPoint !== null) {
        ctx.lineTo(this.freehandPoint.x, this.freehandPoint.y);
      }

      if (this.completed) {
        ctx.closePath();

        ctx.fill();
      }

      ctx.stroke();
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.points.length; i++) {
      ctx.fillStyle = this.selected ? '#943f8b' : '#999';
      ctx.beginPath();
      ctx.arc(this.points[i].x, this.points[i].y, POINT_RADIUS / scale, 0, 2 * Math.PI);
      ctx.fill();

      if (i === 0 && !this.completed) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3 / scale;
        ctx.stroke();
      } else if (i === this.points.length - 1 && !this.completed) {
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3 / scale;
        ctx.stroke();
      }
    }

    if (this.freehandPoint !== null) {
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(this.freehandPoint.x, this.freehandPoint.y, POINT_RADIUS / scale, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  addPoint(x, y, scale) {
    if (this.completed) {
      return -1;
    }

    const i = this.detectPointCollision(x, y, scale);
    if (i === 0 && this.points.length > 2) {
      this.complete();
      return 1;
    } else {
      this.points.push(new CAPoint(x, y));
      return 0;
    }
  }

  complete() {
    if (this.points.length > 2) {
      this.completed = true;
    }
  }

  detectPointCollision(x, y, scale) {
    for (let i = 0; i < this.points.length; i++) {
      const dx = this.points[i].x - x;
      const dy = this.points[i].y - y;
      const dist = dx * dx + dy * dy;
      const scaledCollision = POINT_RADIUS / scale;
      if (dist < scaledCollision * scaledCollision) {
        return i;
      }
    }

    return -1;
  }

  stopFreehand(x, y, scale) {
    if (!this.completed && this.distanceToLastPointGreaterDelta(x, y, FREEHAND_DELTA / 2 / scale)) {
      this.points.push(new CAPoint(x, y));
      this.freehandPoint = null;
    }
  }

  updateFreehand(x, y, scale) {
    if (!this.completed && this.distanceToLastPointGreaterDelta(x, y, FREEHAND_DELTA / scale)) {
      this.points.push(new CAPoint(x, y));
    } else if (this.distanceToFirstPointLessDelta(x, y, POINT_RADIUS / scale) && this.points.length > 3) {
      this.freehandPoint = null;
      this.complete();
    } else {
      this.freehandPoint = new CAPoint(x, y);
    }

    return this.completed;
  }

  distanceToLastPointGreaterDelta(x, y, delta) {
    const li = this.points.length - 1;
    const dx = this.points[li].x - x;
    const dy = this.points[li].y - y;

    return delta * delta < dx * dx + dy * dy;
  }

  distanceToFirstPointLessDelta(x, y, delta) {
    const dx = this.points[0].x - x;
    const dy = this.points[0].y - y;

    return delta * delta > dx * dx + dy * dy;
  }

  pointInside(x, y) {
    let polyCollision = false;

    for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
      if (
        this.points[i].y > y !== this.points[j].y > y &&
        x <
          ((this.points[j].x - this.points[i].x) * (y - this.points[i].y)) / (this.points[j].y - this.points[i].y) +
            this.points[i].x
      ) {
        polyCollision = !polyCollision;
      }
    }

    return polyCollision;
  }
}
