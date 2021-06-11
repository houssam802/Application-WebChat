import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneNotificationComponent } from './zone-notification.component';

describe('ZoneNotificationComponent', () => {
  let component: ZoneNotificationComponent;
  let fixture: ComponentFixture<ZoneNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
