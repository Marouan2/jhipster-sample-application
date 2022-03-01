import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IConcent, Concent } from '../concent.model';
import { ConcentService } from '../service/concent.service';
import { TypeConcent } from 'app/entities/enumerations/type-concent.model';
import { StatusConcent } from 'app/entities/enumerations/status-concent.model';

@Component({
  selector: 'jhi-concent-update',
  templateUrl: './concent-update.component.html',
})
export class ConcentUpdateComponent implements OnInit {
  isSaving = false;
  typeConcentValues = Object.keys(TypeConcent);
  statusConcentValues = Object.keys(StatusConcent);

  editForm = this.fb.group({
    id: [],
    type: [],
    status: [],
    createdDate: [],
    updatedDate: [],
  });

  constructor(protected concentService: ConcentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ concent }) => {
      this.updateForm(concent);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const concent = this.createFromForm();
    if (concent.id !== undefined) {
      this.subscribeToSaveResponse(this.concentService.update(concent));
    } else {
      this.subscribeToSaveResponse(this.concentService.create(concent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConcent>>): void {
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

  protected updateForm(concent: IConcent): void {
    this.editForm.patchValue({
      id: concent.id,
      type: concent.type,
      status: concent.status,
      createdDate: concent.createdDate,
      updatedDate: concent.updatedDate,
    });
  }

  protected createFromForm(): IConcent {
    return {
      ...new Concent(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      status: this.editForm.get(['status'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value,
      updatedDate: this.editForm.get(['updatedDate'])!.value,
    };
  }
}
