import { TestBed, async } from '@angular/core/testing';
import { StartComponent } from './start.component';

describe('StartComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StartComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(StartComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
