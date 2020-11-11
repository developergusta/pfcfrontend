import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-featured-section',
  templateUrl: './featured-section.component.html',
  styleUrls: ['./featured-section.component.scss']
})
export class FeaturedSectionComponent implements OnInit {
  eventos: Evento[];

  constructor(private _eventoService: EventoService) { }

  ngOnInit(): void {
    this.getTodayEvent();
  }

  async getTodayEvent() {
    const result:any = await this._eventoService.getTodayEvent();
    this.eventos = result;
  }

}
