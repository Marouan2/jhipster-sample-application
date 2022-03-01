import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConcentDetailComponent } from './concent-detail.component';

describe('Concent Management Detail Component', () => {
  let comp: ConcentDetailComponent;
  let fixture: ComponentFixture<ConcentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConcentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ concent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConcentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConcentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load concent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.concent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
