import dayjs from 'dayjs/esm';
import { ISouscription } from 'app/entities/jhipsterSampleApplication/souscription/souscription.model';
import { Brand } from 'app/entities/enumerations/brand.model';

export interface IConsumer {
  id?: number;
  ikpi?: string | null;
  brand?: Brand | null;
  scope?: string | null;
  alias?: string | null;
  telematicld?: string | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
  souscription?: ISouscription | null;
}

export class Consumer implements IConsumer {
  constructor(
    public id?: number,
    public ikpi?: string | null,
    public brand?: Brand | null,
    public scope?: string | null,
    public alias?: string | null,
    public telematicld?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public updatedDate?: dayjs.Dayjs | null,
    public souscription?: ISouscription | null
  ) {}
}

export function getConsumerIdentifier(consumer: IConsumer): number | undefined {
  return consumer.id;
}
