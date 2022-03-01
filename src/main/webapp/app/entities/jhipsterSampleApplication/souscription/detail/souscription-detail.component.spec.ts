import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SouscriptionDetailComponent } from './souscription-detail.component';

describe('Souscription Management Detail Component', () => {
  let comp: SouscriptionDetailComponent;
  let fixture: ComponentFixture<SouscriptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouscriptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ souscription: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SouscriptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SouscriptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load souscription on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.souscription).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
