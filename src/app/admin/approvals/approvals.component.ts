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

  async ngOnInit() {

    try {
      // this.validation();
      
      this.eventos = await this.getEventosPendentes();
      let data = await this.getEventosPendentes();
      data.forEach((item, index, object) => {
        if (item.status === 'PENDENTE') {
          object.splice(index, 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getEventosPendentes() {
    const result = await this.eventoService.getAllEvento();
    return result;
    // localStorage.setItem('eventos', this.eventos.toString());
  }

  aprovarEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.type = true;
  }

  negarEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.type = false;
  }

  confirmApproval(confirm: boolean){

  }

  confirmar(template: any) {
      this.eventoService.putEvento(this.evento).subscribe(
        () => {
          template.hide();
          this.getEventosPendentes();
          if(this.type){
          this.toastr.success('Aprovado com Sucesso!');
          } else {
          this.toastr.success('Aprovado com Sucesso!');
          }
        }, error => {
          this.toastr.error(`Erro ao Editar: ${error}`);
        }
      );

  }

  openModal(template: any) {
    template.show();
  }

}
