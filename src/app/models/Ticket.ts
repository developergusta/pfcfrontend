import { Cashback } from './Cashback';
export class Ticket{
  constructor() { }

  ticketId?: number;
  registerTime?: Date;
  userId: number;
  eventId: number;
  lotId?: number;
  lotCategoryId?: number;
  cashbackId?: Cashback;
}
