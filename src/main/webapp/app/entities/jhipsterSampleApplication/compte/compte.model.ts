import dayjs from 'dayjs/esm';
import { IConcent } from 'app/entities/jhipsterSampleApplication/concent/concent.model';

export interface ICompte {
  id?: number;
  idPFM?: string | null;
  alias?: string | null;
  rib?: string | null;
  createdDate?: dayjs.Dayjs | null;
  concents?: IConcent[] | null;
}

export class Compte implements ICompte {
  constructor(
    public id?: number,
    public idPFM?: string | null,
    public alias?: string | null,
    public rib?: string | null,
    public createdDate?: dayjs.Dayjs | null,
    public concents?: IConcent[] | null
  ) {}
}

export function getCompteIdentifier(compte: ICompte): number | undefined {
  return compte.id;
}
