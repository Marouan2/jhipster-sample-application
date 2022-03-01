import dayjs from 'dayjs/esm';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';
import { StatusSouscription } from 'app/entities/enumerations/status-souscription.model';

export interface ISouscription {
  id?: number;
  status?: StatusSouscription | null;
  createdDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  concent?: IConcent | null;
}

export class Souscription implements ISouscription {
  constructor(
    public id?: number,
    public status?: StatusSouscription | null,
    public createdDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public concent?: IConcent | null
  ) {}
}

export function getSouscriptionIdentifier(souscription: ISouscription): number | undefined {
  return souscription.id;
}
