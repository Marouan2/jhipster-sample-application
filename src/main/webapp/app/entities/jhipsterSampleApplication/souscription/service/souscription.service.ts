import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISouscription, getSouscriptionIdentifier } from '../souscription.model';

export type EntityResponseType = HttpResponse<ISouscription>;
export type EntityArrayResponseType = HttpResponse<ISouscription[]>;

@Injectable({ providedIn: 'root' })
export class SouscriptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/souscriptions', 'jhipstersampleapplication');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(souscription: ISouscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(souscription);
    return this.http
      .post<ISouscription>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(souscription: ISouscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(souscription);
    return this.http
      .put<ISouscription>(`${this.resourceUrl}/${getSouscriptionIdentifier(souscription) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(souscription: ISouscription): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(souscription);
    return this.http
      .patch<ISouscription>(`${this.resourceUrl}/${getSouscriptionIdentifier(souscription) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISouscription>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISouscription[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSouscriptionToCollectionIfMissing(
    souscriptionCollection: ISouscription[],
    ...souscriptionsToCheck: (ISouscription | null | undefined)[]
  ): ISouscription[] {
    const souscriptions: ISouscription[] = souscriptionsToCheck.filter(isPresent);
    if (souscriptions.length > 0) {
      const souscriptionCollectionIdentifiers = souscriptionCollection.map(
        souscriptionItem => getSouscriptionIdentifier(souscriptionItem)!
      );
      const souscriptionsToAdd = souscriptions.filter(souscriptionItem => {
        const souscriptionIdentifier = getSouscriptionIdentifier(souscriptionItem);
        if (souscriptionIdentifier == null || souscriptionCollectionIdentifiers.includes(souscriptionIdentifier)) {
          return false;
        }
        souscriptionCollectionIdentifiers.push(souscriptionIdentifier);
        return true;
      });
      return [...souscriptionsToAdd, ...souscriptionCollection];
    }
    return souscriptionCollection;
  }

  protected convertDateFromClient(souscription: ISouscription): ISouscription {
    return Object.assign({}, souscription, {
      createdDate: souscription.createdDate?.isValid() ? souscription.createdDate.format(DATE_FORMAT) : undefined,
      endDate: souscription.endDate?.isValid() ? souscription.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? dayjs(res.body.createdDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((souscription: ISouscription) => {
        souscription.createdDate = souscription.createdDate ? dayjs(souscription.createdDate) : undefined;
        souscription.endDate = souscription.endDate ? dayjs(souscription.endDate) : undefined;
      });
    }
    return res;
  }
}
