import { Evento } from './Evento';
import { Ticket } from './Ticket';
import { Image } from './Image';
import { Address } from './Address';
import { Phone } from './Phone';
import { Login } from './Login';
export class User {
  constructor() {
  }

  userId?: number;
  name: string;
  dateBirth?: Date;
  registerTime?: Date;
  cpf?: string;
  rg?: string;
  status?: string;
  credit?: number;
  imageId?: number;
  image?: Image;
  login?: Login;
  events?: Evento[];
  tickets?: Ticket[];
  phones?: Phone[];
  addresses?: Address[];
}
