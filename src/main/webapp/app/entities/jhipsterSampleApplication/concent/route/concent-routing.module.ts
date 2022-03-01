import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConcentComponent } from '../list/concent.component';
import { ConcentDetailComponent } from '../detail/concent-detail.component';
import { ConcentUpdateComponent } from '../update/concent-update.component';
import { ConcentRoutingResolveService } from './concent-routing-resolve.service';

const concentRoute: Routes = [
  {
    path: '',
    component: ConcentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConcentDetailComponent,
    resolve: {
      concent: ConcentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConcentUpdateComponent,
    resolve: {
      concent: ConcentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConcentUpdateComponent,
    resolve: {
      concent: ConcentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(concentRoute)],
  exports: [RouterModule],
})
export class ConcentRoutingModule {}
