import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenForecastComponent } from './screen-forecast.component';

describe('ScreenForecastComponent', () => {
  let component: ScreenForecastComponent;
  let fixture: ComponentFixture<ScreenForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenForecastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
