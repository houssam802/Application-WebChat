import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneMsgsComponent } from './zone-msgs.component';

describe('ZoneMsgsComponent', () => {
  let component: ZoneMsgsComponent;
  let fixture: ComponentFixture<ZoneMsgsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneMsgsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneMsgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
