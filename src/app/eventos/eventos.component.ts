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
  now: Date;

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
      this.now = new Date();
      this.eventos = await this.getEventos();
      this.filterEventsOcurreds();
    } catch (error) {

    }

    this.getMenorValor(1);
  }



  async getEventos() {
    this.eventos = await this.eventoService.getEventosAprovados();

    console.log(this.eventos)
    this.eventos.forEach((evts) => {
      if (!evts.images.length || evts.images === null) {
        let img = new Image();
        img.src = 'https://image.flaticon.com/icons/png/512/2558/2558944.png';
        evts.images.push(img);
      }
    });

    return this.eventos;
  }

  filterEventsOcurreds() {

    this.eventos = this.eventos.filter(
      evento => new Date(evento.dateEnd) >= this.now
    );

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
  
  openModal(template: any) {
    template.show();
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
