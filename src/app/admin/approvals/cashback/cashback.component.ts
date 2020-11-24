import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cashback } from 'src/app/models/Cashback';
import { Evento } from 'src/app/models/Evento';
import { User } from 'src/app/models/User';
import { EventoService } from 'src/app/_services/evento.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-cashback',
  templateUrl: './cashback.component.html',
  styleUrls: ['./cashback.component.scss']
})
export class CashbackAdminComponent implements OnInit {

  titulo = 'Cashbacks para aprovar';
  cashbacks: Cashback[] = [];
  user: User;
  evento: Evento;
  eventos: Evento[];
  usuarios: User[];
  approve: boolean;
  descCashback: string;

  constructor(
    private ticketService: TicketService,
    private userService: UsuarioService,
    private eventoService: EventoService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    await this.getCashbacks();

    console.log(this.cashbacks)
  }

  async getCashbacks() {
    this.cashbacks = await this.ticketService.getCashbackList()
  }

  async getUserById(id: number) {
    this.userService.getUserById(id).then(
      user => this.user = user
    );
  }

  async getEventById(id: number) {
    this.eventoService.getEventoById(id).then(
      evento => this.evento = evento
    );
  }

  aprovarCashback(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.approve = true;
  }

  negarCashback(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.approve = false;
  }

  openModal(template: any) {
    template.show();
  }

  confirmar(template: any) {
    if (this.approve) {
      this.ticketService.aprovarCashback(this.evento).then(
        () => {
          template.hide();
          this.toastr.success('Aprovado com Sucesso!');
        })
    }
    else {
      this.ticketService.negarCashback(this.evento).then(
        () => {
          template.hide();
          this.toastr.warning('Cashback negado!');
        })
    }
  }
}
