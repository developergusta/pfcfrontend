import { HomeModule } from './../home/home.module';
import { ApprovalsAdminComponent } from './approvals/approvals.component';
import { EditUsuariosAdminComponent } from './usuarios/editUsuarios/editUsuarios.component';
import { EditEventosAdminComponent } from './eventos/editEventos/editEventos.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoutingModule } from './../app-routing.module';
import { UsuariosAdminComponent } from './usuarios/usuarios.component';
import { EventosAdminComponent } from './eventos/eventos.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterAdminComponent } from './footer/footer.component';
import { NavbarAdminComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxMaskModule } from 'ngx-mask';
import { CashbackAdminComponent } from './approvals/cashback/cashback.component';



@NgModule({
  declarations: [HomeComponent,
    NavbarAdminComponent,
    FooterAdminComponent,
    SidebarComponent,
    EventosAdminComponent,
    UsuariosAdminComponent,
    EditEventosAdminComponent,
    EditUsuariosAdminComponent,
    ApprovalsAdminComponent,
    CashbackAdminComponent,
  ],
  exports: [
    HomeComponent,
    SidebarComponent,
    NavbarAdminComponent,
    FooterAdminComponent,
    EventosAdminComponent,
    EditEventosAdminComponent,
    UsuariosAdminComponent,
    EditUsuariosAdminComponent,
    ApprovalsAdminComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    CurrencyMaskModule,
    NgxMaskModule.forRoot(),
    HomeModule
  ],
  providers: []
})
export class AdminModule { }
