import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from './../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  model: any = {};
  constructor(
      private usuarioService: UsuarioService
    , public router: Router
    , private toast: ToastrService
    , private fb: FormBuilder) { }

  registerForm: FormGroup;

  ngOnInit(): void {
    this.validation();
    if (window.sessionStorage.getItem('token') != null){
      this.router.navigate(['/home']);
      setInterval(() => {
        window.location.reload(); // atualiza a página após 3 segundos
       }, 2000);
    }
  }

  login(): any {
    if (this.registerForm.valid){
      this.model = Object.assign({}, this.registerForm.value);
      this.usuarioService.login(this.model)
      .subscribe(
        () => {
          this.toast.success('Você está logado');
          if (this.usuarioService.role === 'ADMINISTRADOR'){
            this.router.navigate(['/admin/home']);
          }
          else if (this.usuarioService.role === 'USUARIO'){
            this.router.navigate(['/profile']);
          }
        },
        () => {
          this.toast.error('Email ou senha incorretos');
        }
      );
    }
  }

  public validation(): any{
    this.registerForm = this.fb.group({
      login: this.fb.group({
        email: ['', [Validators.required, /*Validators.email, */Validators.maxLength(255)]],
        pass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
      })
    });
  }

}
