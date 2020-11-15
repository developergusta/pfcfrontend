import { Ticket } from './../models/Ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/Evento';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  baseURL = environment.baseURL + '/Ticket';

  constructor(private http: HttpClient) { }

  async getTicketsByUserId(id: number){
    const result = await this.http.get<Evento[]>(`${this.baseURL}/User/${id}`).toPromise();
    console.log(result);
    return result;
  }

  buyTicket(tickets: Ticket[]){
   return this.http.post(`${this.baseURL}/Buy`, tickets).toPromise();
    
  }
}
