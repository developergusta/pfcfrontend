import { Ticket } from './Ticket';

export class Cashback {
    constructor() {}

    cashbackId?: number;
    description?: string;
    status?: string;
    dateSolicitation?: Date;
    dateCashback?: Date;
    ticket?: Ticket;
}