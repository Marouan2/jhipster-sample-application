import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SouscriptionComponent } from '../list/souscription.component';
import { SouscriptionDetailComponent } from '../detail/souscription-detail.component';
import { SouscriptionUpdateComponent } from '../update/souscription-update.component';
import { SouscriptionRoutingResolveService } from './souscription-routing-resolve.service';

const souscriptionRoute: Routes = [
  {
    path: '',
    component: SouscriptionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SouscriptionDetailComponent,
    resolve: {
      souscription: SouscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SouscriptionUpdateComponent,
    resolve: {
      souscription: SouscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SouscriptionUpdateComponent,
    resolve: {
      souscription: SouscriptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(souscriptionRoute)],
  exports: [RouterModule],
})
export class SouscriptionRoutingModule {}
