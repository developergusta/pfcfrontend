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

  user: User = new User();
  tickets: Ticket[] = [];
  events: Evento[] = [];
  lotCategories: LotCategory[] = [];
  event: Evento;
  formCashback: string = '';
  ticket: Ticket;
  cashbackIsSolicited: boolean[] = [];
  constructor(
    private ticketService: TicketService,
    private userService: UsuarioService,
    private eventService: EventoService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    try {
      await this.getUser();
      await this.getTickets();
      for (let index = 0; index < this.tickets.length; index++) {
        await this.getEventById(index);
        await this.getLotCategoriesByIds(index);
      }
      console.log(this.tickets.length)
      console.log(this.lotCategories.length)
    } catch (error) {

    }

  }

  async getUser() {
    this.user = JSON.parse(await this.userService.getUserLogged());
  }

  async getTickets() {
    try {
      await this.ticketService.getTicketsByUserId(this.user.userId).then(
        resp => {
          this.tickets = resp
        }
      );
      console.log(this.tickets)
      this.tickets.forEach((tkt, index) => {
        if (tkt.cashback) {
          this.cashbackIsSolicited[index] = true;
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  async getEventById(index: number) {
    let evento = await this.eventService.getEventoById(this.tickets[index].eventId);
    this.events.push(evento);
  }

  async getLotCategoriesByIds(index: number) {
    this.user.tickets.forEach(x => this.eventService.getLotCategoryByTicket(x)
      .then(result => {
        this.lotCategories.push(result);
      })
      .catch(err => {
        this.lotCategories.push(new LotCategory());
      }));
  }

  public async downloadTicket(ticket: Ticket) {
    let evento = await this.eventService.getEventoById(ticket.eventId);
    let doc = new jsPDF();
    doc.setFontSize(25);
    doc.text(`Ingresso - ${evento.titleEvent}`, 20, 20);

    const pipe = new DatePipe('pt-BR');
    doc.setFontSize(16);
    doc.text(`DE ${pipe.transform(evento.dateStart, 'short')} À ${pipe.transform(evento.dateEnd, 'short')}`, 20, 35);
    let dataBuy = new DatePipe('pt-BR').transform(ticket.registerTime, 'dd/MM/yyyy hh:mm');
    doc.text(`Comprado às - ${dataBuy}`, 20, 45);
    doc.text(`Comprador - ${this.user.name}`, 20, 55);
    doc.text(`RG - ${this.user.rg}`, 20, 65);
    doc.text(`CPF - ${this.user.cpf}`, 20, 75);
    let dataNasc = new DatePipe('pt-BR').transform(this.user.dateBirth, 'dd/MM/yyyy');
    let imgData = '../../../assets/img/logo/ticket2u_logo.png'
    doc.text(`Data de nascimento - ${dataNasc}`, 20, 85);

    doc.setFontSize(12);
    doc.text(`Não esqueça de apresentar os documentos no local do evento`, 40, 105);
    doc.addImage(imgData, 'JPEG', 60, 215, 90, 55)
    doc.save("voucher.pdf");
  }

  requestCashback(template: any, tkt: Ticket) {
    this.ticket = tkt;
    this.openModal(template);
  }

  async confirmRequestCashback(template: any) {
    this.ticket.cashback = new Cashback();
    this.ticket.cashback.cashbackId = 0;
    this.ticket.cashback.description = this.formCashback;
    await this.ticketService.requestCashback(this.ticket)
      .then(() => {
        this.toastr.success('Sua solicitação foi enviada a um administrador, aguarde que iremos entrar em contato')
      }).catch(error => {
        this.toastr.error('erro na solicitação');
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
