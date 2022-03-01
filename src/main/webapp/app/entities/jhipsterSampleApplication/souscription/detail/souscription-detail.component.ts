import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISouscription } from '../souscription.model';

@Component({
  selector: 'jhi-souscription-detail',
  templateUrl: './souscription-detail.component.html',
})
export class SouscriptionDetailComponent implements OnInit {
  souscription: ISouscription | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ souscription }) => {
      this.souscription = souscription;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
