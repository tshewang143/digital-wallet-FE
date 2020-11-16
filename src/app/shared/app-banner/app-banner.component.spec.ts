import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppBannerComponent } from './app-banner.component';

describe('AppBannerComponent', () => {
  let component: AppBannerComponent;
  let fixture: ComponentFixture<AppBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
