import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/Evento';
import { Image } from 'src/app/models/Image';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-featured-section',
  templateUrl: './featured-section.component.html',
  styleUrls: ['./featured-section.component.scss']
})
export class FeaturedSectionComponent implements OnInit {
  eventos: Evento[];
  now = new Date();

  constructor(private eventoService: EventoService) { }

  async ngOnInit() {
    var week = new Date(this.now);
    week.setDate(week.getDate() + 40);
    await this.getEventsToShow(week);
  }


  async getEventsToShow(week: Date) {
    this.eventos = await this.eventoService.getEventosAprovados();
    this.eventos.forEach( x => {
      if(new Date(x.dateStart) > this.now && new Date(x.dateStart) < week){
        x.dateStart
      }
      else{
        console.log('no')
      }
    })
    this.eventos = this.eventos.filter(x => 
      new Date(x.dateStart) > this.now && new Date(x.dateStart) < week
    );
    

    this.eventos.forEach((evts) => {
      if (!evts.images.length || evts.images === null) {
        let img = new Image();
        img.src = 'https://image.flaticon.com/icons/png/512/2558/2558944.png';
        evts.images.push(img);
      }
    });
    
  }

}
