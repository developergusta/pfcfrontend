import { SelectCategoryComponent } from './eventos/select-category/select-category.component';
import { TicketsComponent } from './profile/tickets/tickets.component';
import { EventsComponent } from './profile/events/events.component';
import { EditComponent } from './profile/edit/edit.component';
import { EditComponent as EditEventComponent } from './profile/events/edit/edit.component';
import { ProfileComponent } from './profile/profile.component';

import { ApprovalsAdminComponent } from './admin/approvals/approvals.component';
import { CashbackAdminComponent } from './admin/approvals/cashback/cashback.component';
import { EditUsuariosAdminComponent } from './admin/usuarios/editUsuarios/editUsuarios.component';
import { EditEventosAdminComponent } from './admin/eventos/editEventos/editEventos.component';
import { UsuariosAdminComponent } from './admin/usuarios/usuarios.component';
import { EventosAdminComponent } from './admin/eventos/eventos.component';

import { HomeComponent as HomeComponentAdmin } from './admin/home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { EventosComponent } from './eventos/eventos.component';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'eventos',
    children: [
      { path: '', component: EventosComponent },
      { path: ':id/category', component: SelectCategoryComponent },
    ]
  },
  { path: 'eventos', component: EventosComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    children: [
      { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
      { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
      { path: 'events/:id/edit', component: EditEventComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'home', component: HomeComponentAdmin },
      { path: 'usuarios', component: UsuariosAdminComponent },
      { path: 'usuario/:id/edit', component: EditUsuariosAdminComponent },
      { path: 'eventos', component: EventosAdminComponent },
      { path: 'evento/:id/edit', component: EditEventosAdminComponent },
      { path: 'approvals', component: ApprovalsAdminComponent },
      { path: 'approvals/cashback', component: CashbackAdminComponent },
    ],
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
