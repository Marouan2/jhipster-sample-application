import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConsumerService } from '../service/consumer.service';

import { ConsumerComponent } from './consumer.component';

describe('Consumer Management Component', () => {
  let comp: ConsumerComponent;
  let fixture: ComponentFixture<ConsumerComponent>;
  let service: ConsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ConsumerComponent],
    })
      .overrideTemplate(ConsumerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsumerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConsumerService);

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
    expect(comp.consumers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
