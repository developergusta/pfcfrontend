import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import * as moment from 'moment';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  user: User = new User();
  role: string;
  name: string;
  hoje = new Date();

  constructor(private http: HttpClient
    , private toast: ToastrService
    , private storage: AngularFireStorage
    ) { }

  login(model: any) {
    return this.http
      .post(`${environment.baseURL}/Login`, model).pipe(
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

  getToken(): any{
    return sessionStorage.getItem('token');
  }

  getUserName(): string {
    this.name = this.jwtHelper.decodeToken(sessionStorage.getItem('token')).unique_name;
    return this.name;
  }

  register(model: any) {
    console.log(model);
    return this.http.post(`${environment.baseURL}`, model);
  }

  getUserLogged(){
    const userLogged = sessionStorage.getItem('user');
    return userLogged;
  }

  async createAccount(account: any) {
    const result = await this.http.post<any>(`${environment.baseURL}`, account).toPromise();
    return result;
  }

  async updateUser(user: User) {
    const result = this.http.put(`${environment.baseURL}/${user.userId}`, user)
    .toPromise().
    then(
        () => this.toast.success('Atualizado com sucesso')
    ).catch(
      () => this.toast.error('Erro ao atualizar')
    )
    ;
    return result;
  }

  async recoverPass(cpf: string) {
    const result = await this.http.post<any>(`${environment.baseURL}/RecoverPass`, cpf).toPromise();
    return result;
  }

  async alternPass(users: User[]) {
    const result = await this.http.post<any>(`${environment.baseURL}/AlternPass`, users).toPromise();
    return result;
  }

  async deleteUser(id: number) {
    const result = await this.http.delete(`${environment.baseURL}/Delete/${id}`).toPromise() ;
    return result;
  }

  async getUsersList(){
    const result = this.http.get<User[]>(environment.baseURL).toPromise();

    return result;
  }

   getIdade(dataNasc: Date){
    const hoje = moment(this.hoje);
    const nasc = moment(dataNasc);
    const idade = moment.duration(hoje.diff(nasc));
    console.log(Math.trunc(idade.asYears()));
    return Math.trunc(idade.asYears());
  }

  async getUserById(id: number){
    const result = await this.http.get<User>(`${environment.baseURL}/${id}`).toPromise();
    return result;
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    const task = this.storage.upload(filePath, file);
  }

  getAuthorizationToken() {
    const token = sessionStorage.getItem('token');
    return token;
  }

  async getMyTickets(id: number){
    const result = await this.http.get(`${environment.baseURL}/MyTickets/${id}`).toPromise() ;
    return result;
  }

  getTokenExpirationDate(token: string): Date {
    const decoded: any = this.jwtHelper.decodeToken(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }

    return !(date.valueOf() > new Date().valueOf());
  }

  isUserLoggedIn() {
    const token = this.getAuthorizationToken();
    if (!token) {
      return false;
    } else if (this.isTokenExpired(token)) {
      return false;
    }

    return true;
  }

}
