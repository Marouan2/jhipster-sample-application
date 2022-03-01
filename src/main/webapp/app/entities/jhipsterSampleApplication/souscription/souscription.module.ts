import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SouscriptionComponent } from './list/souscription.component';
import { SouscriptionDetailComponent } from './detail/souscription-detail.component';
import { SouscriptionUpdateComponent } from './update/souscription-update.component';
import { SouscriptionDeleteDialogComponent } from './delete/souscription-delete-dialog.component';
import { SouscriptionRoutingModule } from './route/souscription-routing.module';

@NgModule({
  imports: [SharedModule, SouscriptionRoutingModule],
  declarations: [SouscriptionComponent, SouscriptionDetailComponent, SouscriptionUpdateComponent, SouscriptionDeleteDialogComponent],
  entryComponents: [SouscriptionDeleteDialogComponent],
})
export class JhipsterSampleApplicationSouscriptionModule {}
