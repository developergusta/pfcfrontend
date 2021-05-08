import { EventoService } from './../_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { User } from './../models/User';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorreiosService } from '../_services/correios.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../_services/usuario.service';
import { Evento } from '../models/Evento';
import { Image } from '../models/Image';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LotCategory } from '../models/LotCategory';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  events: Evento[];
  hora1 = '';
  hr1: {
    hour: 0,
    minute: 0
  };
  hr2: {
    hour: 0,
    minute: 0
  };
  time = { hour: 13, minute: 30 };
  user = new User();
  enderecoBuscado: any;
  now = new Date();
  idade: number;
  dateStart = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  dateEnd = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  evento: Evento = {
    titleEvent: '',
    category: '',
    dateStart: this.now,
    dateEnd: this.now,
    capacity: 0,
    description: '',
    address: {
      city: '',
      complement: '',
      country: '',
      num: 0,
      state: '',
      street: '',
      userId: this.user.userId
    }
  };
  eventos: Evento[];
  eventForm: FormGroup;
  interval: any;
  eventProgress = 0;
  optionsCateg = new Array();
  lotCategories: LotCategory[] = [];


  constructor(
    private correios: CorreiosService,
    private eventoService: EventoService,
    private router: Router,
    private userService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  async ngOnInit() {
    try {

      await this.validation();
      await this.carregarOpcoesCategoria();
      await this.getUser();
      this.calculaIdade();
      await this.getEventos();
      await this.getLotCategories();
    } catch (error) {

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

  showData() {
    console.log(JSON.stringify(this.eventForm.get('dateEnd').value));
  }

  updtHorario1(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.eventForm.controls['dateStart'].setValue(new Date(this.dateStart.setHours(hour, minute)));
    console.log(this.dateStart)

  }

  updtHorario2(event: any) {
    let hour = Number(event.target.value.substring(0, 2));
    let minute = Number(event.target.value.substring(3, 5));

    this.eventForm.controls['dateEnd'].setValue(new Date(this.dateEnd.setHours(hour, minute)));
  }


  agendarEvento() {
    this.evento = Object.assign({}, this.eventForm.value);
    this.evento.userId = this.user.userId;
    if (this.eventForm.valid) {
      this.startTimer();
      console.log(JSON.stringify(this.evento))
      this.eventoService.postEvento(this.evento).subscribe(
        (response) => {
          this.evento = response;
        }, error => {
          this.toastr.error(`Erro ao agendar: ${error.error}`);
          clearInterval(this.interval);
        }
      );
    }
    else {
      this.toastr.error('Você deve preencher todos os campos corretamente');
    }
  }

  public async validation() {
    this.eventForm = this.fb.group({
      titleEvent: [this.evento.titleEvent, [Validators.required]],
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
    });
  }

  calculaIdade() {
    const hoje = moment(this.now);
    const nasc = moment(this.user.dateBirth);
    const idade = moment.duration(hoje.diff(nasc));
    this.idade = Math.trunc(idade.asYears());
  }

  buscaCEP() {
    let cep = this.eventForm.get('address.zipCode').value;
    if (cep != null && cep !== '') {
      this.correios.consultaCep(cep).then(n => {
        this.populateAddress(n);
      });
    }
  }

  populateAddress(address: any) {
    this.eventForm.controls['address'].get('city').setValue(address.localidade)
    this.eventForm.controls['address'].get('state').setValue(address.uf)
    this.eventForm.controls['address'].get('street').setValue(address.logradouro)
  }

  createModalEvent(template: any) {
    if (this.userService.isUserLoggedIn()) {
      this.novoEvento(template);
    }
    else {
      this.toastr.warning('Você precisa estar logado para criar um evento');
      this.router.navigate(['/login']);
    }
  }

  novoEvento(template: any) {
    this.openModal(template);
  }

  openModal(template: any) {
    this.eventForm.reset();
    template.show();
  }


  async getUser() {
    this.user.image = new Image();
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.user = await this.userService.getUserById(this.user.userId);
    this.user.dateBirth = new Date(this.user.dateBirth);
    this.user.dateBirth.setMonth(this.evento.dateStart.getMonth() - 1);
    console.log(this.user.addresses);
  }

  getFirstAddress() {
    if (this.user.addresses) {
      return this.user.addresses[0];
    }
  }

  getTickets() {
    if (this.user.tickets.length > 0) {
      this.router.navigate(['./profile/tickets']);
    }
    else {
      this.toastr.error('Você ainda não comprou nenhum ingresso');
    }
  }

  public openExtratoPDF(): void {
    let doc = new jsPDF();
    autoTable(doc, { html: '#extrato' });
    doc.save("extrato.pdf");
  }

  async getEventos() {
    this.user.events = await this.eventoService.getEventosByUserId(this.user.userId);
  }

  startTimer() {
    if (this.eventProgress < 100) {
      this.interval = setInterval(() => {
        if (this.eventProgress < 100) {
          this.eventProgress++;
        }
        else {
          clearInterval(this.interval);
        }
      }, 50);
    }
  }

  getEventEditUrl() {
    var url = `/profile/events/${this.evento.eventId}/edit`;
    return url;
  }

  async getLotCategories() {

    this.user.tickets.forEach(x => this.eventoService.getLotCategoryByTicket(x)
      .then(result => {
        this.lotCategories.push(result);
      })
      .catch(err => {
        this.lotCategories.push(new LotCategory());
      }));
  }

}

