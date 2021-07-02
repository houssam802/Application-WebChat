import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNonTrouveComponent } from './page-non-trouve.component';

describe('PageNonTrouveComponent', () => {
  let component: PageNonTrouveComponent;
  let fixture: ComponentFixture<PageNonTrouveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageNonTrouveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNonTrouveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
