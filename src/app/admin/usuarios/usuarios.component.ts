import { NgxMaskModule, IConfig } from 'ngx-mask';
import { User } from './../../models/User';
import { UsuarioService } from './../../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Address } from 'src/app/models/Address';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosAdminComponent implements OnInit {


  constructor(private userService: UsuarioService, private toastr: ToastrService, private fb: FormBuilder) { }

  titulo = 'Usuarios';
  dateBirth: Date;
  now = new Date();
  dateRef = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 1);
  minDate = new Date(this.now.getFullYear() - 120, this.now.getMonth(), this.now.getDate());
  maxDate = new Date(this.now.getFullYear() - 14, this.now.getMonth(), this.now.getDate());

  usuariosFiltrados: User[];
  users: User[];
  usuario: User;
  modoSalvar = 'post';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  userForm: FormGroup;
  bodyDeletarUsuario = '';

  file: File;
  fileNameToUpdate: string;

  dataAtual: string;

  _filtroLista = '';

  async ngOnInit() {
    try {
      // console.log(this.addresses);
      this.validation();
      this.users = await this.getUsuarios();
      // let arrayControl = this.userForm.get('addresses') as FormArray;
      // console.log(arrayControl);

    } catch (error) {
      console.log(error);
    }
  }  

  async getUsuarios() {
    const users = await this.userService.getUsersList();
    users.forEach( u => u.dateBirth = new Date(u.dateBirth) )
    console.log(users);
    return users;
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtroLista ? this.filtrarUsuarios(this.filtroLista) : this.users;
  }

  filtrarUsuarios(filtrarPor: string): User[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.users.filter(
      usuario => usuario.name.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }



  editUser(usuario: User, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    console.log(usuario);
    usuario.dateBirth = new Date(usuario.dateBirth);
    this.userForm.patchValue(usuario);
  }

  newUser(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excludeUser(usuario: User, template: any) {
    this.openModal(template);
    this.usuario = usuario;
    this.bodyDeletarUsuario = `Tem certeza que deseja excluir o usuario ${usuario.name}, Código: ${usuario.userId} ?`;
  }

  banUser(usuario: User, template: any) {
    this.openModal(template);
    this.usuario = usuario;
  }

  reactivateUser(usuario: User, template: any) {
    this.openModal(template);
    this.usuario = usuario;
  }

  openModal(template: any) {
    this.userForm.reset();
    template.show();
    this.validation();
  }

  salvarAlteracao(template: any) {
    if (this.userForm.valid) {
      if (this.modoSalvar === 'post') {
        this.usuario = Object.assign({}, this.usuario);

        this.userService.createAccount(this.usuario).then(
          (novousuario: User) => {
            template.hide();
            this.getUsuarios();
            this.toastr.success(`Inserido com sucesso! ${novousuario}`);
          }).catch(error => {
            this.toastr.error(`Erro ao inserir: ${error}`);
          });

      } else {
        this.usuario = Object.assign({ id: this.usuario.userId }, this.userForm.value);

        console.log(JSON.stringify(this.userForm.value))
        this.userService.updateUser(this.userForm.value).then(
          () => {
            template.hide();
            this.getUsuarios();
            this.toastr.success('Editado com Sucesso!');
          }).catch(error => {
            this.toastr.error(`Erro ao Editar: ${error}`);
          }
        );
      }
    }
  }


  confirmDelete(template: any) {
    this.userService.deleteUser(this.usuario.userId).then(
      () => {
        template.hide();
        this.getUsuarios();
        this.toastr.success('Deletado com Sucesso');
      }).catch( error => {
        this.toastr.error('Erro ao tentar Deletar');
        console.log(error);
      }
    );
  }

  confirmBanUser(template: any){
    this.userService.banUser(this.usuario).then(
      () => {
        template.hide();
        this.getUsuarios();
        this.toastr.success(`Usuário ${this.usuario.name} banido...`);
      }).catch( error => {
        this.toastr.error('Erro ao tentar Deletar');
        console.log(error);
      }
    );
  }

  confirmReactivateUser(template: any){
    this.userService.ReactivateUser(this.usuario).then(
      () => {
        template.hide();
        this.getUsuarios();
        this.toastr.success(`Usuário ${this.usuario.name}reativado com Sucesso`);
      }).catch( error => {
        this.toastr.error('Erro ao tentar Deletar');
        console.log(error);
      }
    );;
  }


  public validation(): any {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      dateBirth: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.maxLength(14)]],
      rg: ['', Validators.maxLength(13)],
      login: this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      })
    });
  }
  
  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

}
