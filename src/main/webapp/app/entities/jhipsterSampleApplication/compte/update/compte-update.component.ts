import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICompte, Compte } from '../compte.model';
import { CompteService } from '../service/compte.service';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';
import { ConcentService } from 'app/entities/jhipsterSampleApplication/concent/service/concent.service';

@Component({
  selector: 'jhi-compte-update',
  templateUrl: './compte-update.component.html',
})
export class CompteUpdateComponent implements OnInit {
  isSaving = false;

  concentsSharedCollection: IConcent[] = [];

  editForm = this.fb.group({
    id: [],
    idPFM: [],
    alias: [],
    rib: [],
    createdDate: [],
    concents: [],
  });

  constructor(
    protected compteService: CompteService,
    protected concentService: ConcentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ compte }) => {
      this.updateForm(compte);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const compte = this.createFromForm();
    if (compte.id !== undefined) {
      this.subscribeToSaveResponse(this.compteService.update(compte));
    } else {
      this.subscribeToSaveResponse(this.compteService.create(compte));
    }
  }

  trackConcentById(index: number, item: IConcent): number {
    return item.id!;
  }

  getSelectedConcent(option: IConcent, selectedVals?: IConcent[]): IConcent {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompte>>): void {
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

  protected updateForm(compte: ICompte): void {
    this.editForm.patchValue({
      id: compte.id,
      idPFM: compte.idPFM,
      alias: compte.alias,
      rib: compte.rib,
      createdDate: compte.createdDate,
      concents: compte.concents,
    });

    this.concentsSharedCollection = this.concentService.addConcentToCollectionIfMissing(
      this.concentsSharedCollection,
      ...(compte.concents ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.concentService
      .query()
      .pipe(map((res: HttpResponse<IConcent[]>) => res.body ?? []))
      .pipe(
        map((concents: IConcent[]) =>
          this.concentService.addConcentToCollectionIfMissing(concents, ...(this.editForm.get('concents')!.value ?? []))
        )
      )
      .subscribe((concents: IConcent[]) => (this.concentsSharedCollection = concents));
  }

  protected createFromForm(): ICompte {
    return {
      ...new Compte(),
      id: this.editForm.get(['id'])!.value,
      idPFM: this.editForm.get(['idPFM'])!.value,
      alias: this.editForm.get(['alias'])!.value,
      rib: this.editForm.get(['rib'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      concents: this.editForm.get(['concents'])!.value,
    };
  }
}
