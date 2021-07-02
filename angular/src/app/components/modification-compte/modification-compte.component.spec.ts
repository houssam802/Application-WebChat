import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationCompteComponent } from './modification-compte.component';

describe('ModificationCompteComponent', () => {
  let component: ModificationCompteComponent;
  let fixture: ComponentFixture<ModificationCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationCompteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
