import { Cashback } from './Cashback';
import { Evento } from './Evento';
import { LotCategory } from './LotCategory';
import { User } from './User';
export class Ticket{
  constructor() { }

  ticketId?: number;
  registerTime?: Date;
  user: User;
  userId: number;
  eventId: number;
  event: Evento;
  lotId?: number;
  lotCategory: LotCategory;
  lotCategoryId?: number;
  cashback: Cashback;
  cashbackId?: Cashback;
}
