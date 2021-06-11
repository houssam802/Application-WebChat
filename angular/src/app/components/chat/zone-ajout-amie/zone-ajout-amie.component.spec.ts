import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneAjoutAmieComponent } from './zone-ajout-amie.component';

describe('ZoneAjoutAmieComponent', () => {
  let component: ZoneAjoutAmieComponent;
  let fixture: ComponentFixture<ZoneAjoutAmieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneAjoutAmieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneAjoutAmieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
