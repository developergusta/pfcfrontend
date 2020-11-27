import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  eventsMostSold: Evento[];
  evento: Evento;
  modoSalvar = 'post';
  hora1 = '';

  mostrarImagem = false;
  eventForm: FormGroup;
  bodyDeletarEvento = '';
  optionsCateg = new Array();

  file: File;
  fileNameToUpdate: string;

  dataAtual: string;

  _filtroLista = '';

  async ngOnInit() {
    try {
      this.validation();
      await this.getEventosAprovados();
      await this.getEventsMostSold();
      await this.carregarOpcoesCategoria();
      this.getHora1();
    } catch (error) {
      console.log(error);
    }
  }

  async carregarOpcoesCategoria() {
    this.optionsCateg = [
      { id: 'Futebol', name: 'Futebol' },
      { id: 'Basquete', name: 'Basquete' },
      { id: 'OutrosEsportes', name: 'Outros Esportes' },
      { id: 'MuseuExposicoes', name: 'Museu e Exposições' },
      { id: 'Reveillon', name: 'Reveillón' },
      { id: 'Musica', name: 'Música' },
      { id: 'Infantil', name: 'Infantil' },
      { id: 'CursosWorkshops', name: 'Cursos e Workshops' },
      { id: 'Drive-in', name: 'Drive-In' },
      { id: 'Online', name: 'Online' }];
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

  async getEventosAprovados() {
    this.eventos = await this.eventoService.getEventosAprovados();
    this.eventos.forEach( (evt) => {
      evt.dateStart = new Date(evt.dateStart);
      evt.dateStart.setMonth(evt.dateStart.getMonth() - 1);
      evt.dateEnd = new Date(evt.dateEnd);
      evt.dateEnd.setMonth(evt.dateEnd.getMonth() - 1);
    } );
  }

  async getEventsMostSold(){
    this.eventsMostSold = await this.eventoService.getEventsMostSoldInYear();
    console.log(this.eventsMostSold);
  }

  updtHorario1(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.evento.dateStart.setHours(hour, minute);
  }

  updtHorario2(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.evento.dateEnd.setHours(hour, minute);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.category}, Código: ${evento.eventId}`;
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
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

  getHora1() {
    const hora = this.evento.dateStart.getHours();
    const minuto = this.evento.dateStart.getMinutes();
    let retorno = '';
    if (hora < 10) {
      retorno += '0';
    }
    retorno += hora.toString() + ':';
    if (minuto < 10) {
      retorno += '0';
    }
    retorno += minuto.toString();
    this.hora1 = retorno;
  }

  extrairRelatorio(){
    let doc = new jsPDF();
    autoTable(doc, { html: '#extrato' });
    doc.save("relatorio.pdf");
  }

  async salvarAlteracao(template: any) {
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
        try {
          await this.eventoService.updateEvento(this.evento);
         template.hide();
            this.getEventosAprovados();
            this.toastr.success('Editado com Sucesso!');
        } catch (error) {
          this.toastr.error(`Erro ao Editar: ${error}`);
        }
        
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
      })
    });
  }
}
