import { TestBed, async } from '@angular/core/testing';
import { CampaignsComponent } from './campaigns.component';

describe('CampaignsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignsComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CampaignsComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
