import { Evento } from './../../models/Evento';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/_services/usuario.service';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/_services/ticket.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  user: User;
  tickets: Ticket[];
  event: Evento;
  constructor(
    private ticketService: TicketService,
    private router: Router,
    private userService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getTickets();
  }

  getUser(){
    this.user = JSON.parse(this.userService.getUserLogged());
  }

  getTickets(){
    this.ticketService.getTicketsByUserId(this.user.userId).then(
      resp => this.tickets = resp
    );
  }

}
