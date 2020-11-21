import { UsuarioService } from './../_services/usuario.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/User';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  now = new Date();
  minDate = new Date(this.now.getFullYear() - 120, this.now.getMonth(), this.now.getDate());
  maxDate = new Date(this.now.getFullYear() - 14, this.now.getMonth(), this.now.getDate());
  focus = [false, false, false, false, false];
  user: User = new User();
  constructor(
    // tslint:disable-next-line: max-line-length
    private userService: UsuarioService, private fb: FormBuilder, private toastr: ToastrService, public router: Router, private localeService: BsLocaleService){
      this.localeService.use('pt-br');
    }

  ngOnInit(): void {
    this.validation();
  }

  registerForm: FormGroup;

  createAcount(): any{
    if (this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value);
      this.userService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/login']);
          this.toastr.success('Cadastro Realizado');
        }, error => {
          this.toastr.error('erro no cadastro: ' + this.user);
          console.log(error);
        }
      );

    }
    else{
      this.toastr.error('Você deve preencher todo formulário e concordar com os termos');
    }
  }

  public validation(): any {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      dateBirth: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.maxLength(14)]],
      rg: ['', Validators.maxLength(12)],
      login: this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        pass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
      }),
      termos: ['',[Validators.required]]
    });
  }
}
