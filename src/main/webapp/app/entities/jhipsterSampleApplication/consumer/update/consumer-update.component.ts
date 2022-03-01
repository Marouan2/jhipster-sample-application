import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConsumer, Consumer } from '../consumer.model';
import { ConsumerService } from '../service/consumer.service';
import { ISouscription } from 'app/entities/jhipsterSampleApplication/souscription/souscription.model';
import { SouscriptionService } from 'app/entities/jhipsterSampleApplication/souscription/service/souscription.service';
import { Brand } from 'app/entities/enumerations/brand.model';

@Component({
  selector: 'jhi-consumer-update',
  templateUrl: './consumer-update.component.html',
})
export class ConsumerUpdateComponent implements OnInit {
  isSaving = false;
  brandValues = Object.keys(Brand);

  souscriptionsSharedCollection: ISouscription[] = [];

  editForm = this.fb.group({
    id: [],
    ikpi: [],
    brand: [],
    scope: [],
    alias: [],
    telematicld: [],
    createdDate: [],
    updatedDate: [],
    souscription: [],
  });

  constructor(
    protected consumerService: ConsumerService,
    protected souscriptionService: SouscriptionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consumer }) => {
      this.updateForm(consumer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consumer = this.createFromForm();
    if (consumer.id !== undefined) {
      this.subscribeToSaveResponse(this.consumerService.update(consumer));
    } else {
      this.subscribeToSaveResponse(this.consumerService.create(consumer));
    }
  }

  trackSouscriptionById(index: number, item: ISouscription): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsumer>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(consumer: IConsumer): void {
    this.editForm.patchValue({
      id: consumer.id,
      ikpi: consumer.ikpi,
      brand: consumer.brand,
      scope: consumer.scope,
      alias: consumer.alias,
      telematicld: consumer.telematicld,
      createdDate: consumer.createdDate,
      updatedDate: consumer.updatedDate,
      souscription: consumer.souscription,
    });

    this.souscriptionsSharedCollection = this.souscriptionService.addSouscriptionToCollectionIfMissing(
      this.souscriptionsSharedCollection,
      consumer.souscription
    );
  }

  protected loadRelationshipsOptions(): void {
    this.souscriptionService
      .query()
      .pipe(map((res: HttpResponse<ISouscription[]>) => res.body ?? []))
      .pipe(
        map((souscriptions: ISouscription[]) =>
          this.souscriptionService.addSouscriptionToCollectionIfMissing(souscriptions, this.editForm.get('souscription')!.value)
        )
      )
      .subscribe((souscriptions: ISouscription[]) => (this.souscriptionsSharedCollection = souscriptions));
  }

  protected createFromForm(): IConsumer {
    return {
      ...new Consumer(),
      id: this.editForm.get(['id'])!.value,
      ikpi: this.editForm.get(['ikpi'])!.value,
      brand: this.editForm.get(['brand'])!.value,
      scope: this.editForm.get(['scope'])!.value,
      alias: this.editForm.get(['alias'])!.value,
      telematicld: this.editForm.get(['telematicld'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      updatedDate: this.editForm.get(['updatedDate'])!.value,
      souscription: this.editForm.get(['souscription'])!.value,
    };
  }
}
