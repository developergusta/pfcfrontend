import { User } from './User';
import { Image } from './Image';
import { Address } from './Address';
import { Lot } from './Lot';
import { Ticket } from './Ticket';
export class Evento {
  constructor() {}

  eventId?: number;
  titleEvent?: string;
  category?: string;
  images?: Image[];
  capacity?: number;
  description?: string;
  status?: string;
  dateStart?: Date;
  dateEnd?: Date;
  lots?: Lot[];
  tickets?: Ticket[];
  address?: Address;
  user?: User;
  userId?: number;
}
