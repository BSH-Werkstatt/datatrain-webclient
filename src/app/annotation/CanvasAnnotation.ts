export class CAPoint {
  public x: number;
  public y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class CanvasAnnotation {
  public points: CAPoint[] = [];

  protected completed = false;

  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  draw(scale: number) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5 / scale;

    if (this.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }

      if (this.completed) {
        ctx.closePath();

        ctx.fill();
      }

      ctx.stroke();
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.points.length; i++) {
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.arc(this.points[i].x, this.points[i].y, 10 / scale, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  addPoint(x, y, scale) {
    if (this.completed) {
      return -1;
    }

    const i = this.detectCollision(x, y, scale);
    if (i === 0) {
      this.complete();
      return 1;
    } else {
      this.points.push(new CAPoint(x, y));
      return 0;
    }
  }

  complete() {
    this.completed = true;
  }

  detectCollision(x, y, scale) {
    for (let i = 0; i < this.points.length; i++) {
      const dist = (this.points[i].x - x) * (this.points[i].x - x) + (this.points[i].y - y) * (this.points[i].y - y);
      if (dist < (10 / scale) * (10 / scale)) {
        return i;
      }
    }

    return -1;
  }
}
