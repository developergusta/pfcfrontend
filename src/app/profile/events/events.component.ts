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

  events: Evento[];
  constructor(
    private eventoService: EventoService,
    private router: Router,
    private userService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
