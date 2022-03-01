import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SouscriptionService } from '../service/souscription.service';
import { ISouscription, Souscription } from '../souscription.model';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';
import { ConcentService } from 'app/entities/jhipsterSampleApplication/concent/service/concent.service';

import { SouscriptionUpdateComponent } from './souscription-update.component';

describe('Souscription Management Update Component', () => {
  let comp: SouscriptionUpdateComponent;
  let fixture: ComponentFixture<SouscriptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let souscriptionService: SouscriptionService;
  let concentService: ConcentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SouscriptionUpdateComponent],
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
      .overrideTemplate(SouscriptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SouscriptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    souscriptionService = TestBed.inject(SouscriptionService);
    concentService = TestBed.inject(ConcentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Concent query and add missing value', () => {
      const souscription: ISouscription = { id: 456 };
      const concent: IConcent = { id: 81430 };
      souscription.concent = concent;

      const concentCollection: IConcent[] = [{ id: 27639 }];
      jest.spyOn(concentService, 'query').mockReturnValue(of(new HttpResponse({ body: concentCollection })));
      const additionalConcents = [concent];
      const expectedCollection: IConcent[] = [...additionalConcents, ...concentCollection];
      jest.spyOn(concentService, 'addConcentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ souscription });
      comp.ngOnInit();

      expect(concentService.query).toHaveBeenCalled();
      expect(concentService.addConcentToCollectionIfMissing).toHaveBeenCalledWith(concentCollection, ...additionalConcents);
      expect(comp.concentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const souscription: ISouscription = { id: 456 };
      const concent: IConcent = { id: 98053 };
      souscription.concent = concent;

      activatedRoute.data = of({ souscription });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(souscription));
      expect(comp.concentsSharedCollection).toContain(concent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Souscription>>();
      const souscription = { id: 123 };
      jest.spyOn(souscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ souscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: souscription }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(souscriptionService.update).toHaveBeenCalledWith(souscription);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Souscription>>();
      const souscription = new Souscription();
      jest.spyOn(souscriptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ souscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: souscription }));
      saveSubject.complete();

      // THEN
      expect(souscriptionService.create).toHaveBeenCalledWith(souscription);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Souscription>>();
      const souscription = { id: 123 };
      jest.spyOn(souscriptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ souscription });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(souscriptionService.update).toHaveBeenCalledWith(souscription);
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
});
