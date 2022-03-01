import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConcentService } from '../service/concent.service';
import { IConcent, Concent } from '../concent.model';

import { ConcentUpdateComponent } from './concent-update.component';

describe('Concent Management Update Component', () => {
  let comp: ConcentUpdateComponent;
  let fixture: ComponentFixture<ConcentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let concentService: ConcentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConcentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ConcentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConcentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    concentService = TestBed.inject(ConcentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const concent: IConcent = { id: 456 };

      activatedRoute.data = of({ concent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(concent));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Concent>>();
      const concent = { id: 123 };
      jest.spyOn(concentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(concentService.update).toHaveBeenCalledWith(concent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Concent>>();
      const concent = new Concent();
      jest.spyOn(concentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concent }));
      saveSubject.complete();

      // THEN
      expect(concentService.create).toHaveBeenCalledWith(concent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Concent>>();
      const concent = { id: 123 };
      jest.spyOn(concentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(concentService.update).toHaveBeenCalledWith(concent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
