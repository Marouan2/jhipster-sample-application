import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISouscription, Souscription } from '../souscription.model';
import { SouscriptionService } from '../service/souscription.service';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';
import { ConcentService } from 'app/entities/jhipsterSampleApplication/concent/service/concent.service';
import { StatusSouscription } from 'app/entities/enumerations/status-souscription.model';

@Component({
  selector: 'jhi-souscription-update',
  templateUrl: './souscription-update.component.html',
})
export class SouscriptionUpdateComponent implements OnInit {
  isSaving = false;
  statusSouscriptionValues = Object.keys(StatusSouscription);

  concentsSharedCollection: IConcent[] = [];

  editForm = this.fb.group({
    id: [],
    status: [],
    createdDate: [],
    endDate: [],
    concent: [],
  });

  constructor(
    protected souscriptionService: SouscriptionService,
    protected concentService: ConcentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ souscription }) => {
      this.updateForm(souscription);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const souscription = this.createFromForm();
    if (souscription.id !== undefined) {
      this.subscribeToSaveResponse(this.souscriptionService.update(souscription));
    } else {
      this.subscribeToSaveResponse(this.souscriptionService.create(souscription));
    }
  }

  trackConcentById(index: number, item: IConcent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISouscription>>): void {
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

  protected updateForm(souscription: ISouscription): void {
    this.editForm.patchValue({
      id: souscription.id,
      status: souscription.status,
      createdDate: souscription.createdDate,
      endDate: souscription.endDate,
      concent: souscription.concent,
    });

    this.concentsSharedCollection = this.concentService.addConcentToCollectionIfMissing(
      this.concentsSharedCollection,
      souscription.concent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.concentService
      .query()
      .pipe(map((res: HttpResponse<IConcent[]>) => res.body ?? []))
      .pipe(
        map((concents: IConcent[]) => this.concentService.addConcentToCollectionIfMissing(concents, this.editForm.get('concent')!.value))
      )
      .subscribe((concents: IConcent[]) => (this.concentsSharedCollection = concents));
  }

  protected createFromForm(): ISouscription {
    return {
      ...new Souscription(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      concent: this.editForm.get(['concent'])!.value,
    };
  }
}
