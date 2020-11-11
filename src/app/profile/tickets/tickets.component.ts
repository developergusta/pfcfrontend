import { Evento } from './../../models/Evento';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/_services/evento.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  user: User;
  events: Evento[];
  event: Evento;
  constructor(
    private eventoService: EventoService,
    private router: Router,
    private userService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  getEventInfo(eventId: number){
    this.eventoService.getEventoById(eventId).toPromise().then(
      resp => this.event = resp
    );
  }

}
