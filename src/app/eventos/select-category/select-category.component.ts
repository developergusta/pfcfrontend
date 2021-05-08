import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { Lot } from 'src/app/models/Lot';
import { Image } from 'src/app/models/Image';
import { Ticket } from 'src/app/models/Ticket';
import { User } from 'src/app/models/User';
import { EventoService } from 'src/app/_services/evento.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss']
})
export class SelectCategoryComponent implements OnInit {

  page = 2;
  page1 = 3;
  evento: Evento;
  lot: Lot;
  selectedLotCategory: any;
  loggedUser: User = new User();
  quantity = 1;

  @ViewChild('tabs')
  private tabs: NgbTabset;


  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UsuarioService,
    private ticketService: TicketService) { }

  async ngOnInit() {
    await this.getEventSelected();
    await this.getLoggedUser();
  }

  async getEventSelected() {
    this.evento = await this.eventoService.getSelectedEvent(this.route.snapshot.paramMap.get('id'));
    this.lot = <Lot>this.evento.lots.filter(x => new Date(x.dateStart) < new Date(Date.now()) && new Date(x.dateEnd) > new Date(Date.now()))[0];
    if(!this.evento.images.length){
      let img = new Image();
      img.src = 'https://image.flaticon.com/icons/png/512/2558/2558944.png';
      this.evento.images.push(img);
    }

  }

  confirmOrder(selectedLotCategory: number) {
    this.selectedLotCategory = selectedLotCategory;
    setTimeout(() => this.tabs.select("tab-confirm"), 100)
  }

  async getLoggedUser() {
    const user = await this.userService.getUserLogged();
    this.loggedUser = JSON.parse(user);
  }

  async buyTickets() {
    let token = sessionStorage.getItem('token');
    if (token) {      
      const ticket = new Ticket();
      ticket.eventId = this.evento.eventId;
      ticket.lotId = this.selectedLotCategory.lotId;
      ticket.lotCategoryId = this.selectedLotCategory.lotCategoryId
      ticket.userId = this.loggedUser.userId;
      const tickets = Array<Ticket>();
      for (let i = 0; i < this.quantity; i++) {
        tickets.push(ticket);
      }
      this.ticketService.buyTicket(tickets)
        .then(() => {
          this.toastr.success('Ingressos comprados com sucesso! Acesse seu perfil para baixar os vouchers!')
        })
        .catch((err) => {
          this.toastr.warning('O ingresso foi adquirido! porém não foi possível o envio do email.')
        });
    }
    else {
      this.toastr.error('Você precisa estar logado para comprar ingressos');
    }
  }
}
