import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Evento } from 'src/app/models/Evento';
import { Lot } from 'src/app/models/Lot';
import { EventoService } from 'src/app/_services/evento.service';
import { UsuarioService } from 'src/app/_services/usuario.service';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss']
})
export class SelectCategoryComponent implements OnInit {

  page = 2;
  page1 = 3;
  evento: Evento;
  lot: Lot;
  selectedLotCategory;
  loggedUser;
  quantity = 1;

  @ViewChild('tabs')
    private tabs:NgbTabset;


  constructor(
    private eventoService: EventoService, private route: ActivatedRoute, private userService: UsuarioService) { }

  ngOnInit(): void {
    this.getEventSelected();
    this.getLoggedUser();
    //this.startTimer();
  }

  async getEventSelected(){
    this.evento = await this.eventoService.getSelectedEvent(this.route.snapshot.paramMap.get('id'));
    this.lot = <Lot>this.evento.lots.filter(x => new Date(x.dateStart) < new Date(Date.now()) && new Date(x.dateEnd) > new Date(Date.now()))[0];
    console.log(this.lot)
  }

  confirmOrder(selectedLotCategory: number) {
    this.selectedLotCategory = selectedLotCategory;
    setTimeout(() => this.tabs.select("tab-confirm"), 100)
  }

   async getLoggedUser() {
    const user = await this.userService.getUserLogged();
    this.loggedUser = JSON.parse(user);
  }

}
