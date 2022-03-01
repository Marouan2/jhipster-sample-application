import dayjs from 'dayjs/esm';
import { ICompte } from 'app/entities/jhipsterSampleApplication/compte/compte.model';
import { TypeConcent } from 'app/entities/enumerations/type-concent.model';
import { StatusConcent } from 'app/entities/enumerations/status-concent.model';

export interface IConcent {
  id?: number;
  type?: TypeConcent | null;
  status?: StatusConcent | null;
  createdDate?: dayjs.Dayjs | null;
  updatedDate?: dayjs.Dayjs | null;
  comptes?: ICompte[] | null;
}

export class Concent implements IConcent {
  constructor(
    public id?: number,
    public type?: TypeConcent | null,
    public status?: StatusConcent | null,
    public createdDate?: dayjs.Dayjs | null,
    public updatedDate?: dayjs.Dayjs | null,
    public comptes?: ICompte[] | null
  ) {}
}

export function getConcentIdentifier(concent: IConcent): number | undefined {
  return concent.id;
}
