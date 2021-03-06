import { TestBed, async } from '@angular/core/testing';
import { CampaignComponent } from './campaign.component';

describe('CampaignComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CampaignComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'bsh-gotcha'`, () => {
    const fixture = TestBed.createComponent(CampaignComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('bsh-gotcha');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(CampaignComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to bsh-gotcha!');
  });
});
