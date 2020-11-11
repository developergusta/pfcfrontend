import { Component, OnInit, Inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { AppService } from './_services/app.service';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

let lastScrollTop = 0;
const delta = 5;
const navbarHeight = 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Ticket2U-App';

  // tslint:disable-next-line: max-line-length
  constructor(
    private appService: AppService
    , private router: Router
    , @Inject(DOCUMENT) private element: ElementRef
    , public location: Location
    , private _http: HttpClient
  ) { }
  @HostListener('window:scroll', ['$event'])
  hasScrolled() {
    const st = window.pageYOffset;
    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta) {
      return;
    }

    const navbar = document.getElementsByTagName('nav')[0];

    // If they scrolled down and are past the navbar, add class .headroom--unpinned.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
      // Scroll Down
      if (navbar.classList.contains('headroom--pinned')) {
        navbar.classList.remove('headroom--pinned');
        navbar.classList.add('headroom--unpinned');
      }
      // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
    } else {
      // Scroll Up
      //  $(window).height()
      if (st + window.innerHeight < document.body.scrollHeight) {
        // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
        if (navbar.classList.contains('headroom--unpinned')) {
          navbar.classList.remove('headroom--unpinned');
          navbar.classList.add('headroom--pinned');
        }
      }
    }

    lastScrollTop = st;
  };
  ngOnInit() {
    this.hasScrolled();
  }


  showAdmin() {
    return this.router.url.match('/admin/');
  }

  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.appService.toggleSidebar();
  }

}
