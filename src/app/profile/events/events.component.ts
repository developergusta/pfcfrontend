import { TicketService } from './../../_services/ticket.service';
import { User } from 'src/app/models/User';
import { Evento } from 'src/app/models/Evento';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/_services/evento.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  user: User;
  events: Evento[];
  constructor(
    private eventoService: EventoService,
    private router: Router,
    private userService: UsuarioService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getEventos();
  }

  getUser(){
    const user = this.userService.getUserLogged();
    this.user = JSON.parse(user);
  }

  async getEventos(){
    this.events = await this.eventoService.getEventosByUserId(this.user.userId);
  }

}
