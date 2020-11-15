import { RouterModule } from '@angular/router';
import { TokenInterceptor } from './http-interceptors/auth-interceptor';
import { EventoService } from './_services/evento.service';
import { UsuarioService } from './_services/usuario.service';
import { AdminModule } from './admin/admin.module';
import { HomeModule } from './home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxMaskModule } from 'ngx-mask';

import { ToastrModule } from 'ngx-toastr';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);

import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EditComponent } from './profile/edit/edit.component';
import { EventsComponent } from './profile/events/events.component';
import { TicketsComponent } from './profile/tickets/tickets.component';
import { SelectCategoryComponent } from './eventos/select-category/select-category.component';
import { EditComponent as EditEventProfileComponent } from './profile/events/edit/edit.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';


@NgModule({
   declarations: [
      AppComponent,
      EventosComponent,
      FooterComponent,
      NavbarComponent,
      LoginComponent,
      ProfileComponent,
      RegisterComponent,
      EditComponent,
      EditEventProfileComponent,
      EventsComponent,
      TicketsComponent,
      SelectCategoryComponent,
   ],
   imports: [
      HomeModule,
      AdminModule,
      BrowserModule,
      AppRoutingModule,
      BsDatepickerModule.forRoot(),
      NgbModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        preventDuplicates: true,
        progressBar: true
     }),
     ModalModule.forRoot(),
     CollapseModule.forRoot(),
     NgxMaskModule.forRoot(),
     CurrencyMaskModule,
     RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
   ],
   providers: [
     UsuarioService,
     EventoService,
     {provide: LOCALE_ID, useValue: 'pt-BR'},
     {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
     },
     { provide: BUCKET, useValue: 'gs://pfc-ticket2u.appspot.com' }
    ],
   bootstrap: [AppComponent]
})
export class AppModule { }
