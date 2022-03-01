import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISouscription } from '../souscription.model';
import { SouscriptionService } from '../service/souscription.service';
import { SouscriptionDeleteDialogComponent } from '../delete/souscription-delete-dialog.component';

@Component({
  selector: 'jhi-souscription',
  templateUrl: './souscription.component.html',
})
export class SouscriptionComponent implements OnInit {
  souscriptions?: ISouscription[];
  isLoading = false;

  constructor(protected souscriptionService: SouscriptionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.souscriptionService.query().subscribe({
      next: (res: HttpResponse<ISouscription[]>) => {
        this.isLoading = false;
        this.souscriptions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISouscription): number {
    return item.id!;
  }

  delete(souscription: ISouscription): void {
    const modalRef = this.modalService.open(SouscriptionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.souscription = souscription;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
