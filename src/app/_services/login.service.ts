import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient
    , private toast: ToastrService
    , private storage: AngularFireStorage
    ) { }

  baseURL = environment.baseURL +  '/Login';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  user: User = new User();
  role: string;
  name: string;

  login(model: any) {
    return this.http
      .post(`${this.baseURL}`, model).pipe(
        map((response: any) => {
          const user = response; 
          if (user) {
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('user', JSON.stringify(user.user));
            sessionStorage.setItem('email', this.decodedToken.email);
            this.role = this.decodedToken.role;
            this.name = this.decodedToken.unique_name;
          }
        })
      );
  }


  async recoverPass(cpf: string) {
    const result = await this.http.post<any>(`${this.baseURL}/RecoverPass`, cpf).toPromise();
    return result;
  }

  async alternPass(users: User[]) {
    const result = await this.http.post<any>(`${this.baseURL}/AlternPass`, users).toPromise();
    return result;
  }
}
