import { LotCategory } from './LotCategory';
export class Lot {
  constructor() {}

  id: number;
  price?: number;
  dateStart?: Date;
  dateEnd?: Date;
  eventId: number;
  lotCategories?: LotCategory[];
}
