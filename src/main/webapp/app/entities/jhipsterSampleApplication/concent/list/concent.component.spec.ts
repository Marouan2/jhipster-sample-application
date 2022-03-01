import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConcentService } from '../service/concent.service';

import { ConcentComponent } from './concent.component';

describe('Concent Management Component', () => {
  let comp: ConcentComponent;
  let fixture: ComponentFixture<ConcentComponent>;
  let service: ConcentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ConcentComponent],
    })
      .overrideTemplate(ConcentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConcentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConcentService);

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
    expect(comp.concents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
