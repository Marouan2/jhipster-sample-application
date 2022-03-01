import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'consumer',
        data: { pageTitle: 'jhipsterSampleApplicationApp.jhipsterSampleApplicationConsumer.home.title' },
        loadChildren: () =>
          import('./jhipsterSampleApplication/consumer/consumer.module').then(m => m.JhipsterSampleApplicationConsumerModule),
      },
      {
        path: 'souscription',
        data: { pageTitle: 'jhipsterSampleApplicationApp.jhipsterSampleApplicationSouscription.home.title' },
        loadChildren: () =>
          import('./jhipsterSampleApplication/souscription/souscription.module').then(m => m.JhipsterSampleApplicationSouscriptionModule),
      },
      {
        path: 'concent',
        data: { pageTitle: 'jhipsterSampleApplicationApp.jhipsterSampleApplicationConcent.home.title' },
        loadChildren: () =>
          import('./jhipsterSampleApplication/concent/concent.module').then(m => m.JhipsterSampleApplicationConcentModule),
      },
      {
        path: 'compte',
        data: { pageTitle: 'jhipsterSampleApplicationApp.jhipsterSampleApplicationCompte.home.title' },
        loadChildren: () => import('./jhipsterSampleApplication/compte/compte.module').then(m => m.JhipsterSampleApplicationCompteModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
