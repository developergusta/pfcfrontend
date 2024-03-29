import { Phone } from './../../models/Phone';
import { Address } from './../../models/Address';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './../../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { CorreiosService } from 'src/app/_services/correios.service';
import { EventoService } from 'src/app/_services/evento.service';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import * as moment from 'moment';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Image } from 'src/app/models/Image';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  hr1: {
    hour: 0,
    minute: 0
  };
  hr2: {
    hour: 0,
    minute: 0
  };
  options = new Array();
  now = new Date();
  idade: number;
  user: User = new User();
  evento: Evento = new Evento();
  eventos: Evento[];
  eventForm: FormGroup;
  index: number;
  reference: number;
  selectedFile: File;
  fileNameToUpdate: string;

  constructor(
    private correios: CorreiosService,
    private router: Router,
    private userService: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storage: AngularFireStorage
  ) { }

  async ngOnInit() {
    try {
      await this.carregarOpcoesTelefone();
      await this.getUser();
      this.validation();
      this.calculaIdade();
      this.fileNameToUpdate = this.user.image.src.toString();
    } catch (error) {
      console.log(error);
    }
  }

  async carregarOpcoesTelefone() {
    this.options = [
      { id: 1, name: 'Residencial' },
      { id: 2, name: 'Celular' },
      { id: 3, name: 'Comercial' }];
  }

  async getUser() {
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.user = await this.userService.getUserById(this.user.userId);

    if(!this.user.image){
      let img = new Image();
      img.src = 'https://toppng.com/uploads/preview/circled-user-icon-user-pro-icon-11553397069rpnu1bqqup.png'
      this.user.image = img;
    }
    
    this.user.dateBirth = new Date(this.user.dateBirth);
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
    });
  }

  calculaIdade() {
    const hoje = moment(this.now);
    const nasc = moment(this.user.dateBirth);
    const idade = moment.duration(hoje.diff(nasc));
    this.idade = Math.trunc(idade.asYears());
  }

  buscaCEP(i: number) {
    let cep = this.user.addresses[i].zipCode;
    if (cep != null && cep !== '') {
      this.correios.consultaCep(cep).then(addr => {
        this.populateAddress(addr, i);
      });
    }
  }

  populateAddress(address: any, i: number) {
    this.user.addresses[i].city = address.localidade;
    this.user.addresses[i].state = address.uf;
    this.user.addresses[i].street = address.logradouro;
  }

  criarEndereco() {
    if (this.user.addresses != null) {
      const addr = new Address();
      addr.addressId = 0;
      this.user.addresses.push(addr);
    }
    else {
      this.user.addresses = new Array();
      this.user.addresses[0] = new Address();
    }
    console.log(this.user)
  }

  criarTelefone() {
    if (this.user.phones != null) {
      const phon = new Phone();
      phon.phoneId = 0;
      this.user.phones.push(phon);
      console.log(this.user);
    }
    else {
      this.user.phones = new Array();
      this.user.phones[0] = new Phone();
    }
  }

  async confirmaExclusaoEndereco(template: any) {
    if(this.user.addresses[this.index].addressId == 0){
    this.user.addresses.splice(this.index);    
    }
    else{
      await this.userService.deleteAddress(this.user.addresses[this.index].addressId)
    }
    template.hide();
  }

  async confirmaExclusaoTelefone(template: any) {
    if(this.user.phones[this.index].phoneId == 0){
    this.user.phones.splice(this.index);
    }
    else{
      await this.userService.deletePhone(this.user.phones[this.index].phoneId)
        .then(() => 
          this.toastr.success('Telefone Excluído com sucesso'))
        .catch((err) => {
          this.toastr.error(err.message);
        })
    }
    template.hide();
  }

  excluirEndereco(template: any, index: number) {
    this.reference = 0;
    this.index = index;
    this.openModal(template);
  }

  excluirTelefone(template: any, index: number) {
    this.reference = 1;
    this.index = index;
    this.openModal(template);
  }

  salvarAlteracoes(template: any) {
    this.reference = 2;
    this.openModal(template);
  }

  getTickets() {
    if (this.user.tickets.length > 0) {
      this.router.navigate(['./profile/tickets']);
    }
    else {
      this.toastr.error('Você ainda não comprou nenhum ingresso');
    }
  }

  openModal(template: any) {
    template.show();
  }

  async onFileChanged(event) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files;
      await this.uploadImagem();
    }
  }

  async uploadImagem() {

    const nomeArquivo = this.user.image.src.split('\\', 3);
    nomeArquivo[2] = nomeArquivo[2].replace(/.png/i, '_' + this.user.userId + '.png');
    nomeArquivo[2] = nomeArquivo[2].replace(/.jpg/i, '_' + this.user.userId + '.jpg');
    nomeArquivo[2] = nomeArquivo[2].replace(/.jpeg/i, '_' + this.user.userId + '.jpeg');


    const file = this.selectedFile[0];
    const filePath = this.user.userId.toString();
    const fileRef = this.storage.ref(`${filePath}/${nomeArquivo[2]}`);
    const task = this.storage.upload(`${filePath}/${nomeArquivo[2]}`, file);

    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(item => this.user.image.src = item))
    ).subscribe();
  }

  async confirmaEdicao(template: any) {
    try {
      console.log(JSON.stringify(this.user))
      await this.userService.updateUser(this.user);
      template.hide();
      this.getUser();
    } catch {
      console.log('Erro ao fazer o update');
    }
  }

}
