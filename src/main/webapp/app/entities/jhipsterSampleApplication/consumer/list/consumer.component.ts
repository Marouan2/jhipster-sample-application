import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsumer } from '../consumer.model';
import { ConsumerService } from '../service/consumer.service';
import { ConsumerDeleteDialogComponent } from '../delete/consumer-delete-dialog.component';

@Component({
  selector: 'jhi-consumer',
  templateUrl: './consumer.component.html',
})
export class ConsumerComponent implements OnInit {
  consumers?: IConsumer[];
  isLoading = false;

  constructor(protected consumerService: ConsumerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.consumerService.query().subscribe({
      next: (res: HttpResponse<IConsumer[]>) => {
        this.isLoading = false;
        this.consumers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConsumer): number {
    return item.id!;
  }

  delete(consumer: IConsumer): void {
    const modalRef = this.modalService.open(ConsumerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.consumer = consumer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
