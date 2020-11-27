import { LotCategory } from './LotCategory';
export class Lot {
  constructor() {}

  lotId?: number;
  dateStart?: Date;
  dateEnd?: Date;
  eventId?: number;
  lotCategories?: LotCategory[];
}
