import { LotCategory } from './../../../models/LotCategory';
import { Lot } from './../../../models/Lot';
import { Evento } from 'src/app/models/Evento';
import { Image } from 'src/app/models/Image';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/_services/evento.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imagens = 0;
  eventProgress = 0;
  hora1 = '';
  hora2 = '';
  horarios = new Array();

  eventForm: FormGroup;
  lots: FormArray = new FormArray([]);
  lotCategories: FormArray = new FormArray([]);

  optionsCateg = new Array();
  indexLot: number;
  indexLotCatg: number;
  reference: number;
  selectedFiles: File[];
  fileNameToUpdate: string;
  now = new Date();

  constructor(
    private correios: CorreiosService,
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    await this.getEventFromUrl();
    await this.getHora1();
    await this.getHora2();
    await this.carregarDatas();
    await this.validation();
    await this.carregarLots();
    await this.carregarOpcoesCategoria();
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

  updtHorario1(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.eventForm.controls['dateStart'].setValue(new Date(this.evento.dateStart.setHours(hour, minute)));

  }

  updtHorario2(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.eventForm.controls['dateEnd'].setValue(new Date(this.evento.dateEnd.setHours(hour, minute)));
  }

  async getEventFromUrl() {
    this.route.params.subscribe(params => {
      this.evento.eventId = parseInt(params.id, 10);
    });

    this.evento = await this.eventoService.getEventoById(this.evento.eventId);
    this.evento.dateStart = new Date(this.evento.dateStart);
    this.evento.dateEnd = new Date(this.evento.dateEnd);
    this.imagens = this.evento.images.length;
  }

  async carregarDatas() {
    if (!this.evento.lots.length) {
      this.evento.lots[0].dateStart = new Date(this.evento.dateStart);
      this.evento.lots[0].dateEnd = new Date(this.evento.dateEnd);
      this.evento.lots[0].lotCategories = [];
      this.evento.lots[0].lotCategories.push(new LotCategory())
    }
    else {
      this.evento.lots.forEach((lot, index) => {
        if (lot.dateStart) {
          lot.dateStart = new Date(lot.dateStart);
        }
        else if (index === 0) {
          lot.dateStart = new Date(this.evento.dateStart);
        }
        else {
          lot.dateStart = new Date(this.evento.lots[index - 1].dateStart);
        }

        if (lot.dateEnd) {
          lot.dateEnd = new Date(lot.dateEnd)
        }
        else if (index === 0) {
          lot.dateEnd = new Date(this.evento.dateEnd);
        }
        else {
          lot.dateEnd = new Date(this.evento.lots[index - 1].dateEnd);
        }
      });
    }
  }

  async carregarLots() {
    if (!this.evento.lots.length) {
      this.lots.push(this.createLot(null));
    }
    else {
      this.evento.lots.forEach((lot, index) => {
        this.addLot(lot);
        lot.lotCategories.forEach(lotCateg => {
          this.criarCategoriaLote(index, lotCateg)
        });
      });
    }
  }

  async getHora1() {

    this.evento.dateStart.setHours(this.evento.dateStart.getHours()-3);
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

  async getHora2() {
    this.evento.dateEnd.setHours(this.evento.dateEnd.getHours()-3);
    const hora = this.evento.dateEnd.getHours();
    const minuto = this.evento.dateEnd.getMinutes();
    let retorno = '';
    if (hora < 10) {
      retorno += '0';
    }
    retorno += hora.toString() + ':';
    if (minuto < 10) {
      retorno += '0';
    }
    retorno += minuto.toString();
    this.hora2 = retorno;
  }


  /** LOTE **/
  getLot(form: any) {
    return form.controls.lots.controls;
  }

  addLotOnObject() {

  }

  addLot(lot: any): void {
    this.lots = this.eventForm.get('lots') as FormArray;
    // adicionando no FormArray
    this.lots.push(this.createLot(lot));
  }

  createLot(lot: any): FormGroup {
    if (lot === null) {
      return this.fb.group({
        lotId: 0,
        dateStart: ['', Validators.required],
        dateEnd: ['', Validators.required],
        lotCategories: this.fb.array([])
      });
    }
    else {
      return this.fb.group({
        lotId: lot.lotId,
        dateStart: [new Date(lot.dateStart), Validators.required],
        dateEnd: [new Date(lot.dateEnd), Validators.required],
        lotCategories: this.fb.array([])
      });
    }
  }

  confirmaExclusaoLote(template: any) {
    this.lots = this.eventForm.get('lots') as FormArray;
    this.lots.removeAt(this.indexLot);
    template.hide();
    if (this.indexLot !== -1) {
      let lotId = this.evento.lots[this.indexLot].lotId;
      this.eventoService.deleteLot(lotId)
        .then( () => {
          this.toastr.success('Lote excluído com sucesso')
        })
        .catch( err => {
          this.toastr.error(err.message);
        })
    }
  }

  excluirLote(template: any, index: number) {
    if (this.evento.lots[index]) {
      this.indexLot = index;
    }
    else {
      this.indexLot = -1;
    }
    this.reference = 0;
    this.openModal(template);
  }


  /******** LOTE *********/



  /******** CATEGORIA DE LOTE *******/
  getLotCategory(i: any) {
    return this.lots.controls[i].get('lotCategories') as FormArray;
  }

  newLotCategory(lotCateg: any): FormGroup {
    if (lotCateg === null) {
      return this.fb.group({
        lotCategoryId: 0,
        desc: ['', [Validators.required]],
        priceCategory: [0, Validators.required]
      });
    }

    else {
      return this.fb.group({
        lotCategoryId: lotCateg.lotCategoryId,
        desc: [lotCateg.desc, Validators.required],
        priceCategory: [lotCateg.priceCategory, [Validators.required, Validators.min(0)]]
      });
    }

  }

  criarCategoriaLote(indexLot: number, value: any) {
    this.lotCategories[indexLot] = this.lots.controls[indexLot].get('lotCategories') as FormArray;
    this.lotCategories[indexLot].push(this.newLotCategory(value));
  }


  confirmaExclusaoCategoriaLote(template: any) {
    this.lotCategories[this.indexLot].removeAt(this.indexLotCatg);
    template.hide();
  }

  excluirCategoriaLote(template: any, indexLot: number, indexLotCatg: number) {
    this.reference = 1;
    this.indexLot = indexLot;
    this.indexLotCatg = indexLotCatg;
    this.openModal(template);
  }
  /******* CATEGORIA DE LOTE ******/
  salvarAlteracoes(template: any) {
    this.reference = 2;
    this.openModal(template);
  }


  async onFileChanged(event: any) {
    if (event.target.files && event.target.files.length) {
      if (event.target.files.length > 5) {
        this.toastr.error('Só é permitido inserir no máximo 5 imagens por evento');
      } else {
        if (this.evento.images === null || this.evento.images.length === 0) {
          this.evento.images = [];
        }

        for (let i = 0; i < event.target.files.length; i++) {
          if (this.evento.images.length < event.target.files.length) {
            this.evento.images.push(new Image());
          }
          this.evento.images[i].src = event.target.files[i];
        }

        this.selectedFiles = event.target.files;
        await this.uploadImagem();

      }
    }
  }

  async uploadImagem() {

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const nomeArquivo = this.evento.eventId.toString() + '_' + i.toString();

      const file = this.selectedFiles[i];
      const filePath = 'event/' + this.evento.eventId.toString();
      const fileRef = this.storage.ref(`${filePath}/${nomeArquivo}`);

      const task = this.storage.upload(`${filePath}/${nomeArquivo}`, file);

      task.snapshotChanges().pipe(
        finalize(() => fileRef.getDownloadURL().subscribe((item) => {
          let images = this.eventForm.get('images') as FormArray;
          images.push(this.newImage(item))

          this.evento.images[i].src = item
        }))
      ).subscribe();
    }
  }

  newImage(img: string) {
    return this.fb.group({
      src: [img, [Validators.required]]
    });
  }


  async buscaCEP() {
    let cep = this.evento.address.zipCode;
    if (cep != null && cep !== '') {
      await this.correios.consultaCep(cep).then(n => {
        this.populateAddress(n);
      });
    }
  }

  populateAddress(address: any) {
    this.evento.address.city = address.localidade;
    this.evento.address.state = address.uf;
    this.evento.address.street = address.logradouro;
  }

  getCorrectDate(dateObj: Date) {
    dateObj = new Date(dateObj);
    dateObj.setMonth(dateObj.getMonth() - 1);
    return dateObj;
  }

  openModal(template: any) {
    template.show();
  }

  public async validation() {

    this.eventForm = this.fb.group({
      titleEvent: [this.evento.titleEvent, [Validators.required]],
      category: [this.evento.category, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      capacity: [this.evento.capacity, [Validators.required, Validators.max(1000000)]],
      description: [this.evento.description, [Validators.required, Validators.maxLength(1000)]],
      dateStart: [this.evento.dateStart, Validators.required],
      dateEnd: [this.evento.dateEnd, Validators.required],
      address: this.fb.group({
        street: [this.evento.address.street, [Validators.required, Validators.maxLength(255)]],
        complement: [this.evento.address.complement, [Validators.maxLength(255)]],
        zipCode: [this.evento.address.zipCode, [Validators.maxLength(20)]],
        num: [this.evento.address.num, [Validators.required, Validators.min(0), Validators.max(99999)]],
        country: [this.evento.address.country, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
        state: [this.evento.address.state, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        city: [this.evento.address.city, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      }),
      lots: this.fb.array([]),
      images: this.fb.array([]),
      userId: this.evento.userId,
      eventId: this.evento.eventId
    });
  }

  async confirmaEdicao(template: any) {
    try {
      this.evento = this.eventForm.value;
      console.log(JSON.stringify(this.evento))
      await this.eventoService.updateEvento(this.evento)
        .then(() => this.toastr.success('Evento alterado com sucesso'))
        .catch(error => this.toastr.error(error.error));
      template.hide();
      this.getEventFromUrl();
    } catch {
      console.log('Erro ao fazer o update');
    }
  }
}
