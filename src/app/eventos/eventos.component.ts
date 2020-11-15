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
    this.eventos = [
      {
        titleEvent: 'Tomorrowland',
        category: 'FESTIVAL',
        address: {
          city: 'Belgica'
        },
        images: [
          {
            src: 'https://as01.epimg.net/en/imagenes/2020/07/24/latest_news/1595600358_707367_1595600632_noticia_normal_recorte1.jpg'
          }
        ],
        description: 'evento para curtir',
        capacity: 100000,
        lots: [
          {
            id: 1,
            dateStart: new Date(1),
            dateEnd: new Date(5),
            lotCategories: [
              { desc: 'Meia', priceCategory: 20 },
              { desc: 'Inteira', priceCategory: 40 },
              { desc: 'Camarote', priceCategory: 50 },
            ]
          }
        ],
        dateStart: new Date(1),
        dateEnd: new Date(5),
        eventId: 1
      },
      {
        titleEvent: 'WorkShop Angular',
        category: 'ONLINE',
        address: {
          city: 'São Paulo'
        },
        description: 'evento para curtir',
        images: [
          {
            src: 'https://cdn.photographylife.com/wp-content/uploads/2017/01/What-is-landscape-photography.jpg'
          }
        ],
        capacity: 1000,
        lots: [
          {
            id: 1,
            dateStart: new Date(1),
            dateEnd: new Date(5),
            lotCategories: [
              { desc: 'Meia', priceCategory: 20 },
              { desc: 'Inteira', priceCategory: 40 },
              { desc: 'Camarote', priceCategory: 50 },
            ]
          }
        ],
        dateStart: new Date(1),
        dateEnd: new Date(5),
        eventId: 2
      },
      {
        titleEvent: 'Show de fim de ano',
        category: 'SHOW',
        address: {
          city: 'Rio de Janeiro'
        },
        description: 'evento para curtir',
        images: [
          {
            src: 'https://cdn.photographylife.com/wp-content/uploads/2017/01/What-is-landscape-photography.jpg'
          }
        ],
        capacity: 20000,
        lots: [
          {
            id: 1,
            dateStart: new Date(1),
            dateEnd: new Date(5),
            lotCategories: [
              { desc: 'Meia', priceCategory: 20 },
              { desc: 'Inteira', priceCategory: 40 },
              { desc: 'Camarote', priceCategory: 50 },
            ]
          }
        ],
        dateStart: new Date(1),
        dateEnd: new Date(5),
        eventId: 3
      },
      {
        titleEvent: 'Palestra de coaching',
        category: 'ONLINE',
        address: {
          city: 'São Paulo'
        },
        description: 'evento para curtir',
        images: [
          {
            src: 'https://cdn.photographylife.com/wp-content/uploads/2017/01/What-is-landscape-photography.jpg'
          }
        ],
        capacity: 300,
        dateStart: new Date(1),
        dateEnd: new Date(5),
        lots: [
          {
            id: 1,
            dateStart: new Date(1),
            dateEnd: new Date(5),
            lotCategories: [
              { desc: 'Meia', priceCategory: 20 },
              { desc: 'Inteira', priceCategory: 40 },
              { desc: 'Camarote', priceCategory: 50 },
            ]
          }
        ],
        eventId: 4
      },
    ],
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
