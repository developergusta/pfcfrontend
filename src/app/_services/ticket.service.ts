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
    console.log(result);
    return result;
  }

  async requestCashback(ticket: Ticket) {
    const result = await this.http.post(`${this.baseURL}/Cashback`, ticket).toPromise();
    return result;
  }

  async aprovarCashback(cashback: Cashback) { 
    console.log(JSON.stringify(cashback))
    return this.http.put(`${this.baseURL}/Cashback/1`, cashback).toPromise();
  }

  async negarCashback(cashback: Cashback) {    
    return this.http.put(`${this.baseURL}/Cashback/0`, cashback).toPromise();
  }
  
}
