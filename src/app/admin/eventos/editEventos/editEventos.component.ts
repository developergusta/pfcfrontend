import { Evento } from './../../../models/Evento';
import { EventoService } from 'src/app/_services/evento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editEventos',
  templateUrl: './editEventos.component.html',
  styleUrls: ['./editEventos.component.scss']
})
export class EditEventosAdminComponent implements OnInit {

  titulo = 'Editar Evento';
  evento: Evento = new Evento();
  imagemURL = ['assets/img/upload.png'];
  userForm: FormGroup;
  file: File;
  fileNameToUpdate: [];

  dataAtual = '';

  get lots(): FormArray {
    return <FormArray>this.userForm.get('lots');
  }

  get lotCategories(): FormArray {
    return <FormArray>this.userForm.get('lotCategories');
  }

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private router: ActivatedRoute) { }

  ngOnInit() {

  }

  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento)
      .then(
        (evento: Evento) => {
          // this.evento = Object.assign({}, evento);
          // evento.images.forEach( (x, index) => {
          //   this.fileNameToUpdate[index] = x.src.toString();

          //   this.imagemURL[index] = `http://localhost:5000/resources/images/${this.evento.images[index]}?_ts=${this.dataAtual}`;

          //   this.evento.imagemURL = '';
          // })

          // this.registerForm.patchValue(this.evento);

          // this.evento.lotes.forEach(lote => {
          //   this.lotes.push(this.criaLote(lote));
          // });
          // this.evento.redesSociais.forEach(redeSocial => {
          //   this.redesSociais.push(this.criaRedeSocial(redeSocial));
          // });
        }
      );
  }

}
