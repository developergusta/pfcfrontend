import { LoginService } from './../_services/login.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from './../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    private usuarioService: UsuarioService,
    private loginService: LoginService
    , public router: Router
    , private toastr: ToastrService
    , private fb: FormBuilder) { }

  registerForm: FormGroup;

  ngOnInit(): void {
    this.validation();
    if (window.sessionStorage.getItem('token') != null) {
      this.router.navigate(['/home']);
      setInterval(() => {
        window.location.reload(); // atualiza a página após 3 segundos
      }, 2000);
    }
  }

  login(): any {
    if (this.registerForm.valid) {
      this.model = Object.assign({}, this.registerForm.value);
      this.loginService.login(this.model)
        .subscribe(
          (response) => {
            const user: any = response;
            if (user) {
              const jwtHelper = new JwtHelperService();
              const decodedToken = jwtHelper.decodeToken(user.token);
              sessionStorage.setItem('token', user.token);
              sessionStorage.setItem('user', JSON.stringify(user.user));
              sessionStorage.setItem('email', decodedToken.email);
              const role = decodedToken.role;
              this.toastr.success('Você está logado');
              
              if (role === 'ADMINISTRADOR') {
                this.router.navigate(['/admin/usuarios']);
              }
              else if (role === 'USUARIO') {
                this.router.navigate(['/profile']);
              }
            }

          },
          (err) => {
            this.toastr.error(err.error);
          }
        );
    }
  }

  public validation(): any {
    this.registerForm = this.fb.group({
      login: this.fb.group({
        email: ['', [Validators.required, Validators.maxLength(255)]],
        pass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
      })
    });
  }

}
