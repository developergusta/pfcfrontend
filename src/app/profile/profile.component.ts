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
import printPDF from '../_relatorios/print';


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

  public openExtratoPDF(): void {
    printPDF(Object.assign(basePrintData, shortPrintData))
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


const basePrintData = {
  'addressSender': {
      'person':'André Kelling',
      'street':'Brückenstraße 3',
      'city':'12439 Berlin',
      'email':'kontakt@andrekelling.de',
      'phone':'+49 (0) 178 1 / 751 157'
  },
  'address': {
      'company':'Johnlands',
      'person':'John Jonaldo',
      'street':'Jonestreet 123',
      'city':'12345 Jenese Joplin',
  },
  'personalInfo': {
      'website': 'https://andrekelling.de',
      'bank': {
          'person':'André Kelling',
          'name':'Noris Bank',
          'IBAN':'DE12 3456 7890 1234 5678 90'
      },
      'taxoffice': {
          'name':'FA Treptow-Köpenick',
          'number':'St-Nr 12/123/12345'
      }
  },
  'label': {
      'invoicenumber':'Invoice No.',
      'invoice':'Invoice for',
      'tableItems':'Items',
      'tableQty':'Qty',
      'tableSinglePrice':'Price',
      'tableSingleTotal':'Total',
      'totalGrand':'Grand Total',
      'contact':'Kontaktdetails',
      'bank':'Bankverbindung',
      'taxinfo':'Steuernummer',
  }
};
const shortPrintData = {
  'invoice': {
      'number':'2018-15738',
      'date':'28.06.2018',
      'subject':'https://andrekelling.de',
      'total':'2.838,00 €',
      'text':'Etiam quis quam. Nullam at arcu a est sollicitudin euismod. Nulla quis diam. Etiam neque. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut\nal ex ea commodi consequatur? Fusce tellus. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Phasellus enim erat,\nvestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie nisl. Suspendisse sagittis ultrices augue. Integer imperdiet lectus quis justo.'
  },
  'items': {
      [0]: {
          'title':'Templating',
          'description':'predefined custom specialities for vague usage in a framework. Sense a light case weight value for exisiting solution services. Provide a case for universal properties.',
          'amount':'1.200,00 €',
          'qty':'2',
          'total':'2.400,00 €'
      },
      [1]: {
          'title':'Design',
          'description':'outwork digital screen UX in different cases for utilities',
          'amount':'876,00 €',
          'qty':'0.5',
          'total':'438,00 €'
      }
  }
};
const longPrintData = {
  'invoice': {
      'number':'2018-15738',
      'location':'Berlin',
      'date':'28.06.2018',
      'subject':'https://andrekelling.de',
      'total':'6.724,00 €',
      'text':'Etiam quis quam. Nullam at arcu a est sollicitudin euismod. Nulla quis diam. Etiam neque. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut\naliquid ex ea commodi consequatur? Fusce tellus. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Phasellus enim erat,\nvestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie nisl. Suspendisse sagittis ultrices augue. Integer imperdiet lectus quis justo.\n' +
      '\n' +
      'Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Fusce nibh. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Donec vitae arcu. Sed convallis magna eu sem. Cras elementum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nulla non lectus sed nisl molestie malesuada. Etiam quis quam. In rutrum. Nullam sit amet magna in magna gravida vehicula. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Nullam dapibus fermentum ipsum. Etiam posuere lacus quis dolor. Integer imperdiet lectus quis justo. Duis viverra diam non justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. vestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a\n' +
      'nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie'
  },
  'items': {
      [0]: {
          'title':'Templating',
          'description':'predefined custom specialities for vague usage in a framework. Sense a light case weight value for exisiting solution services. Provide a case for universal properties.',
          'amount':'1.200,00 €',
          'qty':'2',
          'total':'2.400,00 €'
      },
      [1]: {
          'title':'Design',
          'description':'outwork digital screen UX in different cases for utilities',
          'amount':'876,00 €',
          'qty':'0.5',
          'total':'438,00 €'
      },
      [2]: {
          'title':'Security',
          'description':'develop a 100% secure workflow mechanism by shutting down your PC',
          'amount':'12,00 €',
          'qty':'1',
          'total':'12,00 €'
      },
      [3]: {
          'title':'Capability Training Closure Business Rules Appliance Regulatory',
          'description':'setup your skill mentoring for future reference & allow $ signs to getUsed `because` this should get covered too. Let me just explain not why ß.',
          'amount':'256,00 €',
          'qty':'2',
          'total':'512,00 €'
      },
      [4]: {
          'title':'Templating',
          'description':'predefined custom specialities for vague usage in a framework. Sense a light case weight value for exisiting solution services. Provide a case for universal properties.',
          'amount':'1.200,00 €',
          'qty':'2',
          'total':'2.400,00 €'
      },
      [5]: {
          'title':'Design',
          'description':'outwork digital screen UX in different cases for utilities',
          'amount':'876,00 €',
          'qty':'0.5',
          'total':'438,00 €'
      },
      [6]: {
          'title':'Security',
          'description':'develop a 100% secure workflow mechanism by shutting down your PC',
          'amount':'12,00 €',
          'qty':'1',
          'total':'12,00 €'
      },
      [7]: {
          'title':'Capability Training Closure Business Rules Appliance Regulatory',
          'description':'setup your skill mentoring for future reference & allow $ signs to getUsed `because` this should get covered too. Let me just explain not why ß.',
          'amount':'256,00 €',
          'qty':'2',
          'total':'512,00 €'
      }
  }
};
const longestPrintData = {
  'invoice': {
      'number':'2018-15738',
      'location':'Berlin',
      'date':'28.06.2018',
      'subject':'https://andrekelling.de',
      'total':'888.556.724,00 €',
      'text':'Etiam quis quam. Nullam at arcu a est sollicitudin euismod. Nulla quis diam. Etiam neque. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut\naliquid ex ea commodi consequatur? Fusce tellus. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Phasellus enim erat,\nvestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie nisl. Suspendisse sagittis ultrices augue. Integer imperdiet lectus quis justo.\n' +
      '\n' +
      'Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Fusce nibh. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Donec vitae arcu. Sed convallis magna eu sem. Cras elementum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nulla non lectus sed nisl molestie malesuada. Etiam quis quam. In rutrum. Nullam sit amet magna in magna gravida vehicula. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Nullam dapibus fermentum ipsum. Etiam posuere lacus quis dolor. Integer imperdiet lectus quis justo. Duis viverra diam non justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis jo egestas. vestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a\n' +
      'nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie'+
      'Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Fusce nibh. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Donec vitae arcu. Sed convallis magna eu sem. Cras elementum. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Nulla non lectus sed nisl molestie malesuada. Etiam quis quam. In rutrum. Nullam sit amet magna in magna gravida vehicula. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Nullam dapibus fermentum ipsum. Etiam posuere lacus quis dolor. Integer imperdiet lectus quis justo. Duis viverra diam non justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. vestibulum vel, aliquam a, posuere eu, velit. Integer vulputate sem a\n' +
      'nibh rutrum consequat. Mauris metus. Phasellus faucibus molestie\n' +
      'nisl. Suspendisse sagittis ultrices augue. Integer imperdiet lectus quis\n' +
      'justo.\n' +
      'Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu.\n' +
      'Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus,\n' +
      'nec bibendum odio risus sit amet ante. Fusce nibh. Mauris suscipit,\n' +
      'ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis\n'+
      'Etiam ligula pede, sagittis quis, interdum ultricies, scelerisque eu.\n' +
      'Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus,\n' +
      'nec bibendum odio risus sit amet ante. Fusce nibh. Mauris suscipit'
  },
  'items': {
      [0]: {
          'title':'Templating',
          'description':'predefined custom specialities for vague usage in a framework. Sense a light case weight value for exisiting solution services. Provide a case for universal properties.',
          'amount':'1.200,00 €',
          'qty':'2',
          'total':'2.400,00 €'
      },
      [1]: {
          'title':'Design',
          'description':'outwork digital screen UX in different cases for utilities',
          'amount':'876,00 €',
          'qty':'0.5',
          'total':'438,00 €'
      },
      [2]: {
          'title':'Security',
          'description':'develop a 100% secure workflow mechanism by shutting down your PC',
          'amount':'12,00 €',
          'qty':'1',
          'total':'12,00 €'
      },
      [3]: {
          'title':'Capability Training Closure Business Rules Appliance Regulatory',
          'description':'setup your skill mentoring for future reference & allow $ signs to getUsed `because` this should get covered too. Let me just explain not why ß.',
          'amount':'256,00 €',
          'qty':'2',
          'total':'512,00 €'
      },
      [4]: {
          'title':'Templating',
          'description':'predefined custom specialities for vague usage in a framework. Sense a light case weight value for exisiting solution services. Provide a case for universal properties.',
          'amount':'1.200,00 €',
          'qty':'2',
          'total':'2.400,00 €'
      },
      [5]: {
          'title':'Design',
          'description':'outwork digital screen UX in different cases for utilities',
          'amount':'876,00 €',
          'qty':'0.5',
          'total':'438,00 €'
      },
      [6]: {
          'title':'Security',
          'description':'develop a 100% secure workflow mechanism by shutting down your PC',
          'amount':'12,00 €',
          'qty':'1',
          'total':'12,00 €'
      },
      [7]: {
          'title':'Capability Training Closure Business Rules Appliance Regulatory',
          'description':'setup your skill mentoring for future reference & allow $ signs to getUsed `because` this should get covered too. Let me just explain not why ß.',
          'amount':'256,00 €',
          'qty':'2',
          'total':'512,00 €'
      },
      [8]: {
          'title':'Security Security Security Security Security Security Security',
          'description':'develop a 100% secure workflow mechanism by shutting down your PC',
          'amount':'88812,00 €',
          'qty':'888',
          'total':'88812,00 €'
      },
      [9]: {
          'title':'Capability Training Closure Business Rules Appliance Regulatory',
          'description':'setup your skill mentoring for future reference & allow $ signs to getUsed `because` this should get covered too. Let me just explain not why ß.',
          'amount':'888256,00 €',
          'qty':'88',
          'total':'8888512,00 €'
      }
  }
};
