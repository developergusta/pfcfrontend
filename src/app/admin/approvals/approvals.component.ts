import { UsuarioService } from './../../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/_services/evento.service';
import { FormBuilder } from '@angular/forms';
import { Evento } from 'src/app/models/Evento';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsAdminComponent implements OnInit {

  constructor(private eventoService: EventoService, private toastr: ToastrService, private fb: FormBuilder) { }

  titulo = 'Eventos para aprovar';
  eventos: Evento[];
  evento: Evento;
  type: boolean;
  referencia: boolean;

  async ngOnInit() {
    try {
      this.eventos = await this.getEventosPendentes();
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosPendentes() {
    const result = await this.eventoService.getEventosPendentes();
    return result;
  }

  aprovarEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.type = true;
    this.referencia = true;
  }

  negarEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.type = false;
    this.referencia = true;

  }

  async confirmar(template: any) {
    if (this.type) {
      await this.eventoService.aprovarEvento(this.evento)
        .then(
          () => {
            template.hide();
            this.getEventosPendentes();
            this.toastr.success('Aprovado com Sucesso!');
          })
        .catch((error) => {
          this.toastr.warning('O email não foi enviado')
          this.getEventosPendentes();
        });
    }
    else {
      await this.eventoService.negarEvento(this.evento)
        .then(
          () => {
            template.hide();
            this.getEventosPendentes();
            this.toastr.success('Evento foi negado...');
          })
        .catch((error) => {
          this.toastr.warning('O email não foi enviado')
        })
    }
  }

  openModal(template: any) {
    template.show();
  }

}
