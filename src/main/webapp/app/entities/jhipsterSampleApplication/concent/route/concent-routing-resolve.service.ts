import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConcent, Concent } from '../concent.model';
import { ConcentService } from '../service/concent.service';

@Injectable({ providedIn: 'root' })
export class ConcentRoutingResolveService implements Resolve<IConcent> {
  constructor(protected service: ConcentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConcent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((concent: HttpResponse<Concent>) => {
          if (concent.body) {
            return of(concent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Concent());
  }
}
