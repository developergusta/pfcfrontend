import { Ticket } from './../models/Ticket';
import { UsuarioService } from './usuario.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/Evento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL = environment.baseURL + '/Event';

  constructor(private http: HttpClient,
              private userService: UsuarioService) { }


  async getEventosAprovados(){
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Approved`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosPendentes(){
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Pending`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosNegados(){
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/Denied`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosByUserId(id: number){
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/EventsByUserId/${this.getUserIdLogged()}`).toPromise();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

   async getTodayEvent(){
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

  postEvento(evento: Evento) {
    console.log(evento);
    return this.http.post(this.baseURL, evento);
  }

  updateEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/${evento.eventId}`, evento).toPromise();
  }

  aprovarEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/Approve/${evento.eventId}`, evento);
  }

  negarEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/Deny/${evento.eventId}`, evento);
  }

  deleteEvento(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  getUserIdLogged(){
    const userLogged = JSON.parse(window.sessionStorage.getItem('user'));
    return userLogged.userId;
  }

  getSelectedEvent(eventId: string){
    return this.http.get<Evento>(`${this.baseURL}/${eventId}`).toPromise();
  }

  setSelectedEvent(eventObj: Evento){
    sessionStorage.setItem('eventSelected', JSON.stringify(eventObj));
  }

}
