import { AppService } from './../../_services/app.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarAdminComponent implements OnInit {

  constructor(private appService: AppService, private router: Router, private toastr: ToastrService) { }
  isCollapsed = true;
  ngOnInit() {
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }

  confirmLogout(template: any) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.toastr.info('Você saiu da sua conta...');
    window.location.reload();
    template.hide();
  }

  openModal(template: any) {
    template.show();
  }

}
