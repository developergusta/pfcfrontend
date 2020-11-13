import { LotCategory } from './../../../models/LotCategory';
import { Lot } from './../../../models/Lot';
import { Evento } from 'src/app/models/Evento';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/_services/evento.service';
import { User } from 'src/app/models/User';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { CorreiosService } from 'src/app/_services/correios.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  evento = new Evento();
  eventProgress = 0;
  hr1: {
    hour: 0,
    minute: 0
  };
  hr2: {
    hour: 0,
    minute: 0
  };
  options = new Array();
  eventForm: FormGroup;
  indexLot: number;
  indexLotCatg: number;
  reference: number;
  selectedFiles: File[];
  fileNameToUpdate: string;
  now = new Date();
  dateStart = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1);
  dateEnd = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1);
  constructor(
    private correios: CorreiosService,
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) { }

  async ngOnInit() {
    await this.getEventFromUrl();
    this.carregarOpcoesCategoria();
  }


  carregarOpcoesCategoria() {
    this.options = [
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

  async getEventFromUrl() {
    await this.route.params.subscribe(params => {
      this.evento.eventId = parseInt(params.id, 10);
    });
    await this.eventoService.getEventoById(this.evento.eventId).then( evt => {
      this.evento = evt;
    });
    // this.evento.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    // console.log(parseInt(this.route.snapshot.paramMap.get('id'), 10));
  }

  criarLote() {
    if (this.evento.lots != null) {
      const lot = new Lot();
      lot.id = 0;
      this.evento.lots.push(lot);
    }
    else {
      this.evento.lots = new Array();
      this.evento.lots[0] = new Lot();
    }
  }

  criarCategoriaLote(indexLot: number) {
    if (this.evento.lots[indexLot].lotCategories != null) {
      const lotCateg = new LotCategory();
      lotCateg.id = 0;
      this.evento.lots[indexLot].lotCategories.push(lotCateg);
      console.log(this.evento);
    }
    else {
      this.evento.lots[indexLot].lotCategories = new Array();
      this.evento.lots[indexLot].lotCategories[0] = new LotCategory();
    }
  }

  confirmaExclusaoLote(template: any) {
    this.evento.lots.splice(this.indexLot);
    template.hide();
  }

  confirmaExclusaoCategoriaLote(template: any, indexLot: number) {
    this.evento.lots[indexLot].lotCategories.splice(this.indexLotCatg);
    template.hide();
  }

  excluirLote(template: any, index: number) {
    this.reference = 0;
    this.indexLot = index;
    this.openModal(template);
  }

  excluirCategoriaLote(template: any, index: number) {
    this.reference = 1;
    this.indexLotCatg = index;
    this.openModal(template);
  }

  salvarAlteracoes(template: any) {
    this.reference = 2;
    this.openModal(template);
  }

  openModal(template: any) {
    template.show();
  }

  onFileChanged(event) {
    if (event.target.files && event.target.files.length) {
      if (event.target.files.length > 5) {
        this.toastr.error('Só é permitido inserir no máximo 5 imagens por evento');
      } else {
        debugger
        for (let i = 0; i < event.target.files.length; i++) {
          this.evento.images[i].src = event.target.files[i];
        }
        this.selectedFiles = event.target.files;
        this.uploadImagem();
      }
    }
  }

  async uploadImagem() {

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const nomeArquivo = this.evento.eventId.toString();

      const file = this.selectedFiles[i];
      const filePath = 'event/' + this.evento.eventId.toString();
      const fileRef = this.storage.ref(`${filePath}/${nomeArquivo}`);
      const task = this.storage.upload(`${filePath}/${nomeArquivo}`, file);
      task.snapshotChanges().pipe(
        finalize(() => fileRef.getDownloadURL().subscribe(item => this.evento.images[i].src = item))
      ).subscribe();
    }
  }

  buscaCEP() {
    let cep = this.evento.address.zipCode;
    if (cep != null && cep !== '') {
      this.correios.consultaCep(cep).then(n => {
        this.populateAddress(n);
      });
      // this.eventForm.get('address.city').setValue('abc');
    }
  }

  populateAddress(address: any) {
    this.evento.address.city = address.localidade;
    this.evento.address.state = address.uf;
    this.evento.address.street = address.logradouro;
  }

  async confirmaEdicao(template: any) {
    try {
      await this.eventoService.updateEvento(this.evento);
      template.hide();
      this.getEventFromUrl();
    } catch {
      console.log('Erro ao fazer o update');
    }
  }
}
