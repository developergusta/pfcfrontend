import { EventoService } from './../_services/evento.service';
import { Evento } from './../models/Evento';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor(private eventoService: EventoService, private toastr: ToastrService, private modalService: BsModalService) { }

  titulo = 'Eventos';
  focus1: boolean;
  dataEvento: string;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  modoSalvar = 'post';
  menorPreco: number;

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;
  fileNameToUpdate: string;

  dataAtual: string;

  _filtroLista = '';

  async ngOnInit() {
    try {
    this.eventos = await this.getEventos();
   
    this.getMenorValor(1);
    } catch (error) {
      console.log(error);
    }
  }

  getMenorValor(id: number){
    this.eventos.find( x => x.eventId = id )
      .lots.find( x => x.dateStart < new Date() && x.dateEnd > new Date() )
      .lotCategories.forEach( lotCateg => {
        if ( lotCateg.priceCategory > this.menorPreco){
          this.menorPreco = lotCateg.priceCategory;
        }
    });
    return this.menorPreco;
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.category.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  async getEventos() {
    const events = await this.eventoService.getEventosAprovados();
    console.log(events);
    return events;
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.category}, Código: ${evento.eventId}`;
  }

  openModal(template: any) {
    //this.registerForm.reset();
    template.show();
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.eventId).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com Sucesso');
      }, error => {
        this.toastr.error('Erro ao tentar Deletar');
        console.log(error);
      }
    );
  }

  /*public getPartidasLive() {
    return this.http.get<User>(
      'https://open.faceit.com/data/v4/championships/d6a6b4dc-bef5-4c62-ab71-494e6e6eef87/matches?type=ongoing&offset=0&limit=150',
      {
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer 2f52d9e7-2f15-472e-9210-ce91616d214e'
        ),
      }
    );
  }*/
}
