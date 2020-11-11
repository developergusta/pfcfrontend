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

  async getAllEvento() {
    const result = await this.http.get<Evento[]>(this.baseURL).toPromise();
    console.log(result);
    return result;
  }

  async getEventosAprovados(){
    try {
    const data = await this.getAllEvento();
    data.forEach( (item, index, object) => {
      if (item.status === 'PENDENTE'){
        object.splice(index, 1);
      }
    });
    return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosPendentes(){
    try {
    const data = await this.getAllEvento();
    data.forEach( (item, index, object) => {
        if (item.status === 'APROVADO'){
        object.splice(index);
      }
    });
    return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosByUserId(){
    try {
      const result = await this.http.get<Evento[]>(`${this.baseURL}/getEventsByUserId/${this.getUserIdLogged()}`).toPromise();
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

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postUpload(file: File, name: string) {
    const fileToUplaod = <File>file[0];
    const formData = new FormData();
    formData.append('file', fileToUplaod, name);

    return this.http.post(`${this.baseURL}/upload`, formData);
  }

  postEvento(evento: Evento) {
    console.log(evento);
    return this.http.post(this.baseURL, evento);
  }

  putEvento(evento: Evento) {
    return this.http.put(`${this.baseURL}/${evento.eventId}`, evento);
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