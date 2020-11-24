import { Evento } from './../../models/Evento';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/_services/usuario.service';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/_services/ticket.service';
import { EventoService } from 'src/app/_services/evento.service';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { LotCategory } from 'src/app/models/LotCategory';
import { Cashback } from 'src/app/models/Cashback';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  user: User;
  tickets: Ticket[] = [];
  events: Evento[] = [];
  lotCategories: LotCategory[] = [];
  event: Evento;
  formCashback: string = '';
  ticket: Ticket;
  cashbackIsSolicited: boolean[] = [];
  constructor(
    private ticketService: TicketService,
    private router: Router,
    private userService: UsuarioService,
    private eventService: EventoService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    this.getUser();
    await this.getTickets();
    for (let index = 0; index < this.tickets.length; index++) {
      await this.getEventsByIds(index);
      await this.getLotCategoriesByIds(index);
    }
  }

  getUser() {
    this.user = JSON.parse(this.userService.getUserLogged());
  }

  async getTickets() {
    await this.ticketService.getTicketsByUserId(this.user.userId).then(
      resp => this.tickets = resp
    );
    this.tickets.forEach((tkt, index) => {
      if(tkt.cashback){
        this.cashbackIsSolicited[index] = true;
      }
    });
  }

  async getEventsByIds(index: number) {
    let evento = await this.eventService.getEventoById(this.tickets[index].eventId);
    this.events.push(evento);
  }

  async getLotCategoriesByIds(index: number) {
    let lotCateg = await this.eventService.getLotCategoriesByTickets(this.tickets);
    lotCateg.forEach(x => this.lotCategories.push(x));
  }

  public async downloadTicket(ticket: Ticket) {
    let evento = await this.eventService.getEventoById(ticket.eventId);
    let doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Ingresso - ${evento.titleEvent}`, 20, 20);

    const pipe = new DatePipe('pt-BR');
    doc.setFontSize(16);
    doc.text(`DE ${pipe.transform(evento.dateStart, 'short')} À ${pipe.transform(evento.dateEnd, 'short')}`, 20, 30);
    doc.save("voucher.pdf");
  }

  requestCashback(template: any, tkt: Ticket){
    this.ticket = tkt;
    this.openModal(template);
  }

  async confirmRequestCashback(template: any) {
    this.ticket.cashback = new Cashback();
    this.ticket.cashback.cashbackId = 0;
    this.ticket.cashback.description = this.formCashback;
    await this.ticketService.requestCashback(this.ticket)
      .then( () => {
        this.toastr.success('Sua solicitação foi enviada a um administrador, aguarde que iremos entrar em contato') 
      }).catch( error => {
        this.toastr.error('erro na solicitação: ' + this.user);
        console.log(error);
      }
    );
    template.hide();
    console.log(JSON.stringify(this.ticket));
  }

  openModal(template: any) {
    template.show();
  }

}
