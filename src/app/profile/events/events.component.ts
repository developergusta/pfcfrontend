import { User } from 'src/app/models/User';
import { Evento } from 'src/app/models/Evento';
import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  user: User = new User();
  events: Evento[];
  constructor(
    private eventoService: EventoService,
    private userService: UsuarioService,
  ) { }

  async ngOnInit() {
    await this.getUser();
    this.getEventos();
  }

  async getUser(){
    const userSession = JSON.parse(sessionStorage.getItem('user'));
    this.user = await this.userService.getUserById(userSession.userId);
  }

  async getEventos(){
    this.events = await this.eventoService.getEventosByUserId(this.user.userId);
  }

}
