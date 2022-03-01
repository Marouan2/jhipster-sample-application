import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConcent } from '../concent.model';

@Component({
  selector: 'jhi-concent-detail',
  templateUrl: './concent-detail.component.html',
})
export class ConcentDetailComponent implements OnInit {
  concent: IConcent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ concent }) => {
      this.concent = concent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
