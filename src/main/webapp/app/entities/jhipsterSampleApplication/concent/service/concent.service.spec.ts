import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { TypeConcent } from 'app/entities/enumerations/type-concent.model';
import { StatusConcent } from 'app/entities/enumerations/status-concent.model';
import { IConcent, Concent } from '../concent.model';

import { ConcentService } from './concent.service';

describe('Concent Service', () => {
  let service: ConcentService;
  let httpMock: HttpTestingController;
  let elemDefault: IConcent;
  let expectedResult: IConcent | IConcent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConcentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      type: TypeConcent.CONCENT,
      status: StatusConcent.STATUS_CONCENT,
      createdDate: currentDate,
      updatedDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdDate: currentDate.format(DATE_FORMAT),
          updatedDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Concent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdDate: currentDate.format(DATE_FORMAT),
          updatedDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Concent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Concent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_FORMAT),
          updatedDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Concent', () => {
      const patchObject = Object.assign(
        {
          updatedDate: currentDate.format(DATE_FORMAT),
        },
        new Concent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Concent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          status: 'BBBBBB',
          createdDate: currentDate.format(DATE_FORMAT),
          updatedDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
          updatedDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Concent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addConcentToCollectionIfMissing', () => {
      it('should add a Concent to an empty array', () => {
        const concent: IConcent = { id: 123 };
        expectedResult = service.addConcentToCollectionIfMissing([], concent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concent);
      });

      it('should not add a Concent to an array that contains it', () => {
        const concent: IConcent = { id: 123 };
        const concentCollection: IConcent[] = [
          {
            ...concent,
          },
          { id: 456 },
        ];
        expectedResult = service.addConcentToCollectionIfMissing(concentCollection, concent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Concent to an array that doesn't contain it", () => {
        const concent: IConcent = { id: 123 };
        const concentCollection: IConcent[] = [{ id: 456 }];
        expectedResult = service.addConcentToCollectionIfMissing(concentCollection, concent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concent);
      });

      it('should add only unique Concent to an array', () => {
        const concentArray: IConcent[] = [{ id: 123 }, { id: 456 }, { id: 16412 }];
        const concentCollection: IConcent[] = [{ id: 123 }];
        expectedResult = service.addConcentToCollectionIfMissing(concentCollection, ...concentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const concent: IConcent = { id: 123 };
        const concent2: IConcent = { id: 456 };
        expectedResult = service.addConcentToCollectionIfMissing([], concent, concent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concent);
        expect(expectedResult).toContain(concent2);
      });

      it('should accept null and undefined values', () => {
        const concent: IConcent = { id: 123 };
        expectedResult = service.addConcentToCollectionIfMissing([], null, concent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concent);
      });

      it('should return initial array if no Concent is added', () => {
        const concentCollection: IConcent[] = [{ id: 123 }];
        expectedResult = service.addConcentToCollectionIfMissing(concentCollection, undefined, null);
        expect(expectedResult).toEqual(concentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
