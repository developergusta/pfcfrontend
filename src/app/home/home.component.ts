import { CorreiosService } from './../_services/correios.service';
import { UsuarioService } from './../_services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from './../_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { Image } from '../models/Image';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  enderecoBuscado: any;
  evento: Evento;
  eventos: Evento[];
  eventForm: FormGroup;
  optionsCateg = new Array();
  now = new Date();
  dateStart = new Date(this.now.getFullYear() - 120, this.now.getMonth(), this.now.getDate());
  dateEnd = new Date(this.now.getFullYear() - 14, this.now.getMonth(), this.now.getDate());

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
      await this.getEventos();
      await this.carregarOpcoesCategoria();
    } catch (error) {

    }
  }

  async getEventos() {
    await this.eventoService.getEventosAprovados().then(
      response => {
        this.eventos = response;
        console.log(this.eventos);
      }).catch(error => {
        console.log(error);
      }
      );
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

  salvarAlteracao(template: any) {
    if (this.eventForm.valid) {
      this.evento = this.eventForm.value;
      this.evento.user = this.userService.getUserLogged;

      this.eventoService.postEvento(this.evento).subscribe(
        () => {
          template.hide();
          //this.getEventosAprovados();
          this.toastr.success('Inserido com Sucesso!');
        }, error => {
          this.toastr.error(`Erro ao Inserir: ${error}`);
        }
      );
    }
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

  buscaCEP() {
    let cep = this.eventForm.get('address.zipCode').value;
    if (cep != null && cep !== '') {
      this.correios.consultaCep(cep).then(n => {
        this.populateAddress(n);
      });
      // this.eventForm.get('address.city').setValue('abc');
    }
  }

  populateAddress(address: any) {
    this.eventForm.get('address.city').setValue(address.localidade);
    this.eventForm.get('address.state').setValue(address.uf);
    this.eventForm.get('address.street').setValue(address.logradouro);
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

}
