import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompteService } from '../service/compte.service';
import { ICompte, Compte } from '../compte.model';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';
import { ConcentService } from 'app/entities/jhipsterSampleApplication/concent/service/concent.service';

import { CompteUpdateComponent } from './compte-update.component';

describe('Compte Management Update Component', () => {
  let comp: CompteUpdateComponent;
  let fixture: ComponentFixture<CompteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compteService: CompteService;
  let concentService: ConcentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompteUpdateComponent],
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
      .overrideTemplate(CompteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compteService = TestBed.inject(CompteService);
    concentService = TestBed.inject(ConcentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Concent query and add missing value', () => {
      const compte: ICompte = { id: 456 };
      const concents: IConcent[] = [{ id: 87378 }];
      compte.concents = concents;

      const concentCollection: IConcent[] = [{ id: 31928 }];
      jest.spyOn(concentService, 'query').mockReturnValue(of(new HttpResponse({ body: concentCollection })));
      const additionalConcents = [...concents];
      const expectedCollection: IConcent[] = [...additionalConcents, ...concentCollection];
      jest.spyOn(concentService, 'addConcentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      expect(concentService.query).toHaveBeenCalled();
      expect(concentService.addConcentToCollectionIfMissing).toHaveBeenCalledWith(concentCollection, ...additionalConcents);
      expect(comp.concentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const compte: ICompte = { id: 456 };
      const concents: IConcent = { id: 33427 };
      compte.concents = [concents];

      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(compte));
      expect(comp.concentsSharedCollection).toContain(concents);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Compte>>();
      const compte = { id: 123 };
      jest.spyOn(compteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compte }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(compteService.update).toHaveBeenCalledWith(compte);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Compte>>();
      const compte = new Compte();
      jest.spyOn(compteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compte }));
      saveSubject.complete();

      // THEN
      expect(compteService.create).toHaveBeenCalledWith(compte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Compte>>();
      const compte = { id: 123 };
      jest.spyOn(compteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compteService.update).toHaveBeenCalledWith(compte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackConcentById', () => {
      it('Should return tracked Concent primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackConcentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedConcent', () => {
      it('Should return option if no Concent is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedConcent(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Concent for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedConcent(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Concent is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedConcent(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
