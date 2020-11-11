import { Evento } from 'src/app/models/Evento';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_services/usuario.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  evento = new Evento();

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private userService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getEventFromUrl();
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

}
