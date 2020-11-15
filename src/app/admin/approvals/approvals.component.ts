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
      // this.validation();
      this.eventos = await this.getEventosPendentes();
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosPendentes() {
    const result = await this.eventoService.getEventosPendentes();
    return result;
    // localStorage.setItem('eventos', this.eventos.toString());
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

  confirmar(template: any) {
      this.eventoService.updateEvento(this.evento).subscribe(
        () => {
          template.hide();
          this.getEventosPendentes();
          if(this.type){
          this.toastr.success('Aprovado com Sucesso!');
          } else {
          this.toastr.success('Evento foi negado...');
          }
        }, error => {
          this.toastr.error(`Erro ao aprovar/negar: ${error}`);
        }
      );

  }

  openModal(template: any) {
    template.show();
  }

}
