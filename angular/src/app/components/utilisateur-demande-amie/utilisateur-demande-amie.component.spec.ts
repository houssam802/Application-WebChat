import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurDemandeAmieComponent } from './utilisateur-demande-amie.component';

describe('UtilisateurDemandeAmieComponent', () => {
  let component: UtilisateurDemandeAmieComponent;
  let fixture: ComponentFixture<UtilisateurDemandeAmieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilisateurDemandeAmieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilisateurDemandeAmieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
