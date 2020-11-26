import { EventoService } from './../_services/evento.service';
import { Evento } from './../models/Evento';
import { Image } from './../models/Image';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService,
    private fb: FormBuilder) { }

  titulo = 'Eventos';
  eventForm: FormGroup;
  focus1: boolean;
  dataEvento: string;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  modoSalvar = 'post';
  menorPreco: number;
  now = new Date();

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

    await this.getEventos();

    this.getMenorValor(1);

  }

  getMenorValor(id: number) {
    this.eventos.find(x => x.eventId = id)
      .lots.find(x => x.dateStart < new Date() && x.dateEnd > new Date())
      .lotCategories.forEach(lotCateg => {
        if (lotCateg.priceCategory > this.menorPreco) {
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

  filtrarEventos(event: any): Evento[] {
    let filtrarPor = event.value;
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.titleEvent.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  async getEventos() {

    await this.eventoService.getEventosAprovados().then(
      events => this.eventos = events
    );

    console.log(this.eventos)
    this.eventos.forEach((x) => {
      if (!x.images.length || x.images === null) {
        let img = new Image();
        img.src = 'https://image.flaticon.com/icons/png/512/2558/2558944.png';
        x.images.push(img);
      }
    });



    this.eventos.forEach((item, index, array) => {
      console.log(index)
      if (this.now > new Date(item.dateEnd)) {
        array.splice(index)
      }
    })

  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.category}, Código: ${evento.eventId}`;
  }

  openModal(template: any) {
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

  public validation(): any {
    this.eventForm = this.fb.group({
      titleEvent: ['', [Validators.required]],
      category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      capacity: ['', [Validators.required, Validators.max(1000000)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.maxLength(255)]],
        complement: ['', [Validators.maxLength(255)]],
        zipCode: ['', [Validators.maxLength(20)]],
        num: ['', [Validators.required, Validators.min(0), Validators.max(99999)]],
        country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      })
    });
  }
}
