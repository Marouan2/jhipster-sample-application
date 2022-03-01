import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConcent } from '../concent.model';
import { ConcentService } from '../service/concent.service';

@Component({
  templateUrl: './concent-delete-dialog.component.html',
})
export class ConcentDeleteDialogComponent {
  concent?: IConcent;

  constructor(protected concentService: ConcentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.concentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
