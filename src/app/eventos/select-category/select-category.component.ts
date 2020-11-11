import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss']
})
export class SelectCategoryComponent implements OnInit {

  page = 2;
  page1 = 3;
  evento: Evento;


  constructor(
    private eventoService: EventoService) { }

  ngOnInit(): void {
    //this.getEventSelected();
    //this.startTimer();
  }

  getEventSelected(){
    this.evento = this.eventoService.getSelectedEvent();
  }

}
