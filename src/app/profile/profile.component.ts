import { EventoService } from './../_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { User } from './../models/User';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorreiosService } from '../_services/correios.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../_services/usuario.service';
import { Evento } from '../models/Evento';
import * as moment from 'moment';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  events: Evento[];
  hr1: {
    hour: 0,
    minute: 0
  };
  hr2: {
    hour: 0,
    minute: 0
  };
  time = { hour: 13, minute: 30 };
  user: User = new User();
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


  constructor(
    private correios: CorreiosService,
    private eventoService: EventoService,
    private router: Router,
    private userService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  async ngOnInit() {
    try {
      await this.getUser();
      this.validation();
      this.calculaIdade();
      await this.getEventos();
      await this.carregarOpcoesCategoria();
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

  salvarAlteracao(template: any) {
    // if (this.eventForm.valid) {
    this.startTimer();
    this.evento.user = this.userService.getUserLogged;

    this.eventoService.postEvento(this.evento).subscribe(
      (response) => {
        this.evento = response;
      }, error => {
        this.toastr.error(`Erro ao Inserir: ${error}`);
      }
    );
    // }
  }

  public validation(): any {
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
      // user: this.fb.group({
      //   userId: ['', Validators.required]
      // })
    });
  }

  calculaIdade() {
    const hoje = moment(this.now);
    const nasc = moment(this.user.dateBirth);
    const idade = moment.duration(hoje.diff(nasc));
    this.idade = Math.trunc(idade.asYears());
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
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.user = await this.userService.getUserById(this.user.userId);
    this.user.dateBirth = new Date(this.user.dateBirth);
    this.user.dateBirth.setMonth(this.evento.dateStart.getMonth() - 1);
    console.log(this.user);
  }

  getFirstAddress() {
    return this.user.addresses[0];
  }

  getTickets() {
    if (this.user.tickets.length == 0) {
      this.router.navigate(['./profile/tickets']);
    }
    else {
      this.toastr.error('Você ainda não comprou nenhum ingresso');
    }
  }

  @ViewChild('htmlData') htmlData: ElementRef;

  USERS = [
    {
      "id": 1,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "email": "shanna@melissa.tv",
      "phone": "010-692-6593 x09125"
    },
    {
      "id": 3,
      "name": "Clementine Bauch",
      "email": "nathan@yesenia.net",
      "phone": "1-463-123-4447",
    },
    {
      "id": 4,
      "name": "Patricia Lebsack",
      "email": "julianne@kory.org",
      "phone": "493-170-9623 x156"
    },
    {
      "id": 5,
      "name": "Chelsey Dietrich",
      "email": "lucio@annie.ca",
      "phone": "(254)954-1289"
    },
    {
      "id": 6,
      "name": "Mrs. Dennis",
      "email": "karley@jasper.info",
      "phone": "1-477-935-8478 x6430"
    }
  ];

  public openPDF(): void {
    
  }

  public downloadPDF(): void {
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
  }

  async getEventos(){
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

  getEventEditUrl(){
    var url = `/profile/events/${this.evento.eventId}/edit`;
    return url;
  }
}
