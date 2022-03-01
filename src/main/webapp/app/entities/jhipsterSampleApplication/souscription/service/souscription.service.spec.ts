import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { StatusSouscription } from 'app/entities/enumerations/status-souscription.model';
import { ISouscription, Souscription } from '../souscription.model';

import { SouscriptionService } from './souscription.service';

describe('Souscription Service', () => {
  let service: SouscriptionService;
  let httpMock: HttpTestingController;
  let elemDefault: ISouscription;
  let expectedResult: ISouscription | ISouscription[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SouscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      status: StatusSouscription.STATUS_SOUSCRIPTION,
      createdDate: currentDate,
      endDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Souscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Souscription()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Souscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Souscription', () => {
      const patchObject = Object.assign(
        {
          status: 'BBBBBB',
          endDate: currentDate.format(DATE_FORMAT),
        },
        new Souscription()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Souscription', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_FORMAT),
          endDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Souscription', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSouscriptionToCollectionIfMissing', () => {
      it('should add a Souscription to an empty array', () => {
        const souscription: ISouscription = { id: 123 };
        expectedResult = service.addSouscriptionToCollectionIfMissing([], souscription);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(souscription);
      });

      it('should not add a Souscription to an array that contains it', () => {
        const souscription: ISouscription = { id: 123 };
        const souscriptionCollection: ISouscription[] = [
          {
            ...souscription,
          },
          { id: 456 },
        ];
        expectedResult = service.addSouscriptionToCollectionIfMissing(souscriptionCollection, souscription);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Souscription to an array that doesn't contain it", () => {
        const souscription: ISouscription = { id: 123 };
        const souscriptionCollection: ISouscription[] = [{ id: 456 }];
        expectedResult = service.addSouscriptionToCollectionIfMissing(souscriptionCollection, souscription);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(souscription);
      });

      it('should add only unique Souscription to an array', () => {
        const souscriptionArray: ISouscription[] = [{ id: 123 }, { id: 456 }, { id: 37827 }];
        const souscriptionCollection: ISouscription[] = [{ id: 123 }];
        expectedResult = service.addSouscriptionToCollectionIfMissing(souscriptionCollection, ...souscriptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const souscription: ISouscription = { id: 123 };
        const souscription2: ISouscription = { id: 456 };
        expectedResult = service.addSouscriptionToCollectionIfMissing([], souscription, souscription2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(souscription);
        expect(expectedResult).toContain(souscription2);
      });

      it('should accept null and undefined values', () => {
        const souscription: ISouscription = { id: 123 };
        expectedResult = service.addSouscriptionToCollectionIfMissing([], null, souscription, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(souscription);
      });

      it('should return initial array if no Souscription is added', () => {
        const souscriptionCollection: ISouscription[] = [{ id: 123 }];
        expectedResult = service.addSouscriptionToCollectionIfMissing(souscriptionCollection, undefined, null);
        expect(expectedResult).toEqual(souscriptionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
