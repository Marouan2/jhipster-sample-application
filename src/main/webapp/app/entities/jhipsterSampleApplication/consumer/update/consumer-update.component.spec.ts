import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConsumerService } from '../service/consumer.service';
import { IConsumer, Consumer } from '../consumer.model';
import { ISouscription } from 'app/entities/jhipsterSampleApplication/souscription/souscription.model';
import { SouscriptionService } from 'app/entities/jhipsterSampleApplication/souscription/service/souscription.service';

import { ConsumerUpdateComponent } from './consumer-update.component';

describe('Consumer Management Update Component', () => {
  let comp: ConsumerUpdateComponent;
  let fixture: ComponentFixture<ConsumerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let consumerService: ConsumerService;
  let souscriptionService: SouscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConsumerUpdateComponent],
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
      .overrideTemplate(ConsumerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsumerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    consumerService = TestBed.inject(ConsumerService);
    souscriptionService = TestBed.inject(SouscriptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Souscription query and add missing value', () => {
      const consumer: IConsumer = { id: 456 };
      const souscription: ISouscription = { id: 25347 };
      consumer.souscription = souscription;

      const souscriptionCollection: ISouscription[] = [{ id: 52525 }];
      jest.spyOn(souscriptionService, 'query').mockReturnValue(of(new HttpResponse({ body: souscriptionCollection })));
      const additionalSouscriptions = [souscription];
      const expectedCollection: ISouscription[] = [...additionalSouscriptions, ...souscriptionCollection];
      jest.spyOn(souscriptionService, 'addSouscriptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ consumer });
      comp.ngOnInit();

      expect(souscriptionService.query).toHaveBeenCalled();
      expect(souscriptionService.addSouscriptionToCollectionIfMissing).toHaveBeenCalledWith(
        souscriptionCollection,
        ...additionalSouscriptions
      );
      expect(comp.souscriptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const consumer: IConsumer = { id: 456 };
      const souscription: ISouscription = { id: 68471 };
      consumer.souscription = souscription;

      activatedRoute.data = of({ consumer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(consumer));
      expect(comp.souscriptionsSharedCollection).toContain(souscription);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consumer>>();
      const consumer = { id: 123 };
      jest.spyOn(consumerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consumer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(consumerService.update).toHaveBeenCalledWith(consumer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consumer>>();
      const consumer = new Consumer();
      jest.spyOn(consumerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consumer }));
      saveSubject.complete();

      // THEN
      expect(consumerService.create).toHaveBeenCalledWith(consumer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Consumer>>();
      const consumer = { id: 123 };
      jest.spyOn(consumerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(consumerService.update).toHaveBeenCalledWith(consumer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSouscriptionById', () => {
      it('Should return tracked Souscription primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSouscriptionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
