import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConcentComponent } from './list/concent.component';
import { ConcentDetailComponent } from './detail/concent-detail.component';
import { ConcentUpdateComponent } from './update/concent-update.component';
import { ConcentDeleteDialogComponent } from './delete/concent-delete-dialog.component';
import { ConcentRoutingModule } from './route/concent-routing.module';

@NgModule({
  imports: [SharedModule, ConcentRoutingModule],
  declarations: [ConcentComponent, ConcentDetailComponent, ConcentUpdateComponent, ConcentDeleteDialogComponent],
  entryComponents: [ConcentDeleteDialogComponent],
})
export class JhipsterSampleApplicationConcentModule {}
