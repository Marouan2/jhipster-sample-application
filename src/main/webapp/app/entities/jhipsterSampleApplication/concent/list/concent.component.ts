import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConcent } from '../concent.model';
import { ConcentService } from '../service/concent.service';
import { ConcentDeleteDialogComponent } from '../delete/concent-delete-dialog.component';

@Component({
  selector: 'jhi-concent',
  templateUrl: './concent.component.html',
})
export class ConcentComponent implements OnInit {
  concents?: IConcent[];
  isLoading = false;

  constructor(protected concentService: ConcentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.concentService.query().subscribe({
      next: (res: HttpResponse<IConcent[]>) => {
        this.isLoading = false;
        this.concents = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConcent): number {
    return item.id!;
  }

  delete(concent: IConcent): void {
    const modalRef = this.modalService.open(ConcentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.concent = concent;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
