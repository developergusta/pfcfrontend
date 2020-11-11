import { LotCategory } from './../../../models/LotCategory';
import { Lot } from './../../../models/Lot';
import { Evento } from 'src/app/models/Evento';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_services/usuario.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { EventoService } from 'src/app/_services/evento.service';
import { User } from 'src/app/models/User';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  evento = new Evento();

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
  eventos: Evento[];
  eventForm: FormGroup;
  index: number;
  reference: number;
  selectedFile: File;
  fileNameToUpdate: string;
  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getEventFromUrl();
  }


  async getEvento() {
    this.evento = JSON.parse(window.sessionStorage.getItem('evento'));
    this.evento = await this.eventoService.getEventoById(this.evento.eventId).toPromise();
    console.log(this.evento);
  }

  getEventFromUrl(){
    this.route.params.subscribe( params => {
      this.evento.eventId = parseInt(params.id, 10);
      this.eventoService.getEventoById(this.evento.eventId).toPromise().then( evt => {
        this.evento = evt;
        console.log(this.evento);
      } ) ;
    });

    // this.evento.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    // console.log(parseInt(this.route.snapshot.paramMap.get('id'), 10));
  }

  criarLote(){
    if (this.user.addresses != null){
      const lot = new Lot();
      lot.id = 0;
      this.evento.lots.push(lot);
    }
    else{
      this.evento.lots = new Array();
      this.evento.lots[0] = new Lot();
    }
  }

  criarCategoriaLote(){
    if (this.user.phones != null){
      const lotCateg = new LotCategory();
      lotCateg.id = 0;
      // this.evento.lots[].lotCategories.push(lotCateg);
      console.log(this.evento);
    }
    else{
      // this.evento.lots[].lotCategories = new Array();
      // this.evento.lots[].lotCategories[0] = new LotCategory();
    }
  }

  confirmaExclusaoLote(template: any){
    this.evento.lots.splice(this.index);
    template.hide();
  }

  confirmaExclusaoCategoriaLote(template: any, indexLot: number){
    this.evento.lots[indexLot].lotCategories.splice(this.index);
    template.hide();
  }

  excluirEndereco(template: any, index: number){
    this.reference = 0;
    this.index = index;
    this.openModal(template);
  }

  excluirTelefone(template: any, index: number){
    this.reference = 1;
    this.index = index;
    this.openModal(template);
  }

  salvarAlteracoes(template: any){
    this.reference = 2;
    this.openModal(template);
  }

  openModal(template: any) {
    template.show();
  }

  onFileChanged(event){
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files;
      this.uploadImagem();
    }
  }

  uploadImagem(){
    const nomeArquivo = this.user.image.src.split('\\', 3);
    nomeArquivo[2] = nomeArquivo[2].replace(/.png/i, '_' + this.user.userId + '.png');
    nomeArquivo[2] = nomeArquivo[2].replace(/.jpg/i, '_' + this.user.userId + '.jpg');
    nomeArquivo[2] = nomeArquivo[2].replace(/.jpeg/i, '_' + this.user.userId + '.jpeg');
    this.user.image.src = nomeArquivo[2];

    // this.userService.postUpload(this.selectedFile, nomeArquivo[2]).then(
    //   response => {
    //     this.user.image.src = "http://localhost:5000/Resources/Images/" + response ;
    //   }
    // );
  }


  async confirmaEdicao(template: any){
    try {
      this.user.image.src = 'http://localhost:5000/Resources/Images/'.concat(this.user.image.src);
      await this.userService.updateUser(this.user);
      template.hide();
      this.getEvento();
    } catch  {
      console.log('Erro ao fazer o update');
    }
  }
}
