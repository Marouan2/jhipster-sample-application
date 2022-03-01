import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConcent, getConcentIdentifier } from '../concent.model';

export type EntityResponseType = HttpResponse<IConcent>;
export type EntityArrayResponseType = HttpResponse<IConcent[]>;

@Injectable({ providedIn: 'root' })
export class ConcentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/concents', 'jhipstersampleapplication');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(concent: IConcent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concent);
    return this.http
      .post<IConcent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(concent: IConcent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concent);
    return this.http
      .put<IConcent>(`${this.resourceUrl}/${getConcentIdentifier(concent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(concent: IConcent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concent);
    return this.http
      .patch<IConcent>(`${this.resourceUrl}/${getConcentIdentifier(concent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConcent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConcent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConcentToCollectionIfMissing(concentCollection: IConcent[], ...concentsToCheck: (IConcent | null | undefined)[]): IConcent[] {
    const concents: IConcent[] = concentsToCheck.filter(isPresent);
    if (concents.length > 0) {
      const concentCollectionIdentifiers = concentCollection.map(concentItem => getConcentIdentifier(concentItem)!);
      const concentsToAdd = concents.filter(concentItem => {
        const concentIdentifier = getConcentIdentifier(concentItem);
        if (concentIdentifier == null || concentCollectionIdentifiers.includes(concentIdentifier)) {
          return false;
        }
        concentCollectionIdentifiers.push(concentIdentifier);
        return true;
      });
      return [...concentsToAdd, ...concentCollection];
    }
    return concentCollection;
  }

  protected convertDateFromClient(concent: IConcent): IConcent {
    return Object.assign({}, concent, {
      createdDate: concent.createdDate?.isValid() ? concent.createdDate.format(DATE_FORMAT) : undefined,
      updatedDate: concent.updatedDate?.isValid() ? concent.updatedDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? dayjs(res.body.createdDate) : undefined;
      res.body.updatedDate = res.body.updatedDate ? dayjs(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((concent: IConcent) => {
        concent.createdDate = concent.createdDate ? dayjs(concent.createdDate) : undefined;
        concent.updatedDate = concent.updatedDate ? dayjs(concent.updatedDate) : undefined;
      });
    }
    return res;
  }
}
