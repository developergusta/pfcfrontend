import { Ticket } from './../models/Ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Evento } from '../models/Evento';
import { Cashback } from '../models/Cashback';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  baseURL = environment.baseURL + '/Ticket';

  constructor(private http: HttpClient) { }

  buyTicket(tickets: Ticket[]){
   return this.http.post(`${this.baseURL}/Buy`, tickets).toPromise();
  }

  async getCashbackList(){
    const result = await this.http.get<Cashback[]>(`${this.baseURL}/Cashback`).toPromise();
    return result;
  }

  async getTicketsByUserId(id: number){
    const result = await this.http.get<Ticket[]>(`${this.baseURL}/User/${id}`).toPromise();
    return result;
  }

  async requestCashback(evento: Evento) {
    return this.http.post(`${this.baseURL}/Cashback`, evento);
  }

  async aprovarCashback(evento: Evento) {
    return this.http.put(`${this.baseURL}/Cashback/1`, evento).toPromise();
  }

  async negarCashback(evento: Evento) {
    return this.http.put(`${this.baseURL}/Cashback/0`, evento).toPromise();
  }
  
}
