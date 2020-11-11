import { Evento } from './../../models/Evento';
import { EventoService } from 'src/app/_services/evento.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-ticket',
  templateUrl: './select-ticket.component.html',
  styleUrls: ['./select-ticket.component.scss']
})
export class SelectTicketComponent implements OnInit {

  constructor(private eventoService: EventoService) { }

  evento: Evento;

  ngOnInit(): void {
    this.getEventSelected();
  }

  getEventSelected(){
    this.evento = this.eventoService.getSelectedEvent();
  }

}
