import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-eventos-admin',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosAdminComponent implements OnInit {

  constructor(private eventoService: EventoService, private toastr: ToastrService, private fb: FormBuilder) { }

  titulo = 'Eventos Aprovados';
  dateStart: Date;
  dateEnd: Date;
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  modoSalvar = 'post';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  eventForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;
  fileNameToUpdate: string;

  dataAtual: string;

  _filtroLista = '';

  async ngOnInit() {

    try {
      this.validation();
      const data = await this.getEventosAprovados();
      data.forEach( (item, index, object) => {
        if (item.status === 'PENDENTE'){
          object.splice(index, 1);
        }
      });
      this.eventos = data;
    } catch (error) {
      console.log(error);
    }
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

  getEventosAprovados() {
    const result = this.eventoService.getEventosAprovados();
    console.log(result);
    return result;
    // localStorage.setItem('eventos', this.eventos.toString());
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.category}, Código: ${evento.eventId}`;
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    // this.evento = Object.assign({}, evento);
    // this.fileNameToUpdate = evento.imagemURL.toString();
    // this.evento.images. = '';
    this.eventForm.patchValue(evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  openModal(template: any) {
    this.eventForm.reset();
    template.show();
  }

  salvarAlteracao(template: any) {
    if (this.eventForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.eventForm.value);

        //this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventosAprovados();
            this.toastr.success('Inserido com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Inserir: ${error}`);
          }
        );
      } else {
        this.evento = Object.assign({ id: this.evento.eventId }, this.eventForm.value);

        //this.uploadImagem();

        this.eventoService.updateEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventosAprovados();
            this.toastr.success('Editado com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Editar: ${error}`);
          }
        );
      }
    }
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.eventId).subscribe(
      () => {
        template.hide();
        this.getEventosAprovados();
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
      }),
      // user: this.fb.group({
      //   userId: ['', Validators.required]
      // })
    });
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
