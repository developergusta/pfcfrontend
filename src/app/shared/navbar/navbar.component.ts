import { UsuarioService } from './../../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  public logged = false;
  public perfil = false;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  loggedUser;

  constructor(public location: Location, private router: Router, private toastr: ToastrService, public userService: UsuarioService ) {
  }

  // tslint:disable-next-line: typedef
  async ngOnInit() {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl){
          this.yScrollStack.push(window.scrollY);
        }
     } else if (event instanceof NavigationEnd) {
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else{
          window.scrollTo(0, 0);
        }
     }
   });
   this.location.subscribe((ev:PopStateEvent) => {
    this.lastPoppedUrl = ev.url;
   });

   this.logged = await this.loggedIn();
   this.getLoggedUser();
  }

  isHome(): boolean {
      const titlee = this.location.prepareExternalUrl(this.location.path());

      if ( titlee === '#/home' ) {
          return true;
      }
      else {
          return false;
      }
  }
  isDocumentation(): boolean {
      const titlee = this.location.prepareExternalUrl(this.location.path());
      if ( titlee === '#/documentation' ) {
        return true;
      }
      else {
        return false;
      }
  }

  showMenu() {
    return this.router.url !== '/admin/home';
  }

  async loggedIn() {
    const loggedin = await this.userService.isUserLoggedIn();
    return loggedin;
  }

  async getLoggedUser() {
    const user = await this.userService.getUserLogged();
    this.loggedUser = JSON.parse(user)
  }

  entrar() {
    this.router.navigate(['/user/login']);
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

  userName() {
    return sessionStorage.getItem('username');
  }

  isPerfil(){
    if (this.router.url.indexOf('profile') !== -1){
      return true;
    }
    else{
      return false;
    }
  }
}
