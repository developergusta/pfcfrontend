import { Ticket } from './../models/Ticket';
import { UsuarioService } from './usuario.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from 'src/environments/environment';
import { LotCategory } from '../models/LotCategory';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = environment.baseURL + '/Event';

  constructor(private http: HttpClient) { }


  async getEventosAprovados() {
    const result = await this.http.get<Evento[]>(`${this.baseURL}/Approved`).toPromise();
    console.log(result)
    return result;
  }

  async getEventosPendentes() {
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Pending`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosNegados() {
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Denied`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventsMostSoldInYear() {
    const result = await this.http.get<Evento[]>(`${this.baseURL}/EventsMostSold`).toPromise();
    return result;
  }

  async getEventosByUserId(id: number) {
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/EventsByUserId/${this.getUserIdLogged()}`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getTodayEvent() {
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Today`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  async getEventoById(id: number) {
    const result = await this.http.get<Evento>(`${this.baseURL}/${id}`).toPromise();
    return result;
  }

  async getLotCategoriesById(id: number) {
    const result = await this.http.get<LotCategory>(`${this.baseURL}/LotCategory/${id}`).toPromise();
    return result;
  }

  async getLotCategoryByTicket(ticket: Ticket) {
    const result = this.http.get<LotCategory>(`${this.baseURL}/LotCategoryByTicket/${ticket.lotCategoryId}`).toPromise()
    return result;
  }

  postEvento(evento: Evento) {
    console.log(evento);
    return this.http.post(this.baseURL, evento);
  }

  updateEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/${evento.eventId}`, evento).toPromise();
  }

  async aprovarEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/Approve/${evento.eventId}`, evento).toPromise();
  }

  async negarEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/Deny/${evento.eventId}`, evento).toPromise();
  }

  deleteEvento(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  async deleteLot(id: number) {
    const result = await this.http.delete(`${this.baseURL}/Lot/Delete/${id}`).toPromise()
    return result;
  }

  async deleteLotCategory(id: number) {
    const result = await this.http.delete(`${this.baseURL}/LotCategory/Delete/${id}`).toPromise();
    return result;
  }

  getUserIdLogged() {
    const userLogged = JSON.parse(window.sessionStorage.getItem('user'));
    return userLogged.userId;
  }

  getSelectedEvent(eventId: string) {
    return this.http.get<Evento>(`${this.baseURL}/${eventId}`).toPromise();
  }

  setSelectedEvent(eventObj: Evento) {
    sessionStorage.setItem('eventSelected', JSON.stringify(eventObj));
  }

}
