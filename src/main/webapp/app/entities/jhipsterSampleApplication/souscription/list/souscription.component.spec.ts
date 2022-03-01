import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SouscriptionService } from '../service/souscription.service';

import { SouscriptionComponent } from './souscription.component';

describe('Souscription Management Component', () => {
  let comp: SouscriptionComponent;
  let fixture: ComponentFixture<SouscriptionComponent>;
  let service: SouscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SouscriptionComponent],
    })
      .overrideTemplate(SouscriptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SouscriptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SouscriptionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.souscriptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
