import { UsuarioService } from './../../_services/usuario.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public router: Router, public userService: UsuarioService) { }

  adminName: string;

  returnsAdminName() {
    sessionStorage.setItem('name', this.userService.getUserName());
    return this.userService.getUserName();
  }

  ngOnInit(): void {
    console.log(this.userService.getUserName());
    this.returnsAdminName();
  }

}
