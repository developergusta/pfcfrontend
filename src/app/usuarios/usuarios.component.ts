import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  title = 'Usuários';

  usuarios = [
    {nome: 'Gustavo'},
    {nome: 'Oliveira'},
    {nome: 'Junior'},
    {nome: 'Kleber'},
    {nome: 'João'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
