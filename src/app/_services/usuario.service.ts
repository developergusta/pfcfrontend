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

  baseURL = environment.baseURL + '/Usuario';
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

  /** GET HTTP */
  async getUsersList() {
    const result = this.http.get<User[]>(this.baseURL).toPromise();
    return result;
  }

  async getUserById(id: number) {
    const result = await this.http.get<User>(`${this.baseURL}/${id}`).toPromise();
    return result;
  }  

  async getMyTickets(id: number) {
    const result = await this.http.get(`${this.baseURL}/MyTickets/${id}`).toPromise();
    return result;
  }
  /** GET HTTP */
  /** GET FUNCTIONS */
  getToken(): any {
    return sessionStorage.getItem('token');
  }

  getUserName(): string {
    this.name = this.jwtHelper.decodeToken(sessionStorage.getItem('token')).unique_name;
    return this.name;
  }  

  async getUserLogged() {
    const userLogged = sessionStorage.getItem('user');
    return userLogged;
  }

  getIdade(dataNasc: Date) {
    const hoje = moment(this.hoje);
    const nasc = moment(dataNasc);
    const idade = moment.duration(hoje.diff(nasc));
    console.log(Math.trunc(idade.asYears()));
    return Math.trunc(idade.asYears());
  }  

  getAuthorizationToken() {
    const token = sessionStorage.getItem('token');
    return token;
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
  /** GET FUNCTIONS */

  /** POST HTTP */  
  async createAccount(account: any) {
    const result = await this.http.post<any>(`${this.baseURL}`, account).toPromise();
    return result;
  }
  /** POST HTTP **/  

  /** PUT HTTP **/  
  async updateUser(user: User) {
    const result = this.http.put(`${this.baseURL}/${user.userId}`, user)
      .toPromise()
      .then(
        () => this.toast.success('Atualizado com sucesso'))
        .catch(
        () => this.toast.error('Erro ao atualizar'));
    return result;
  }
  
  async banUser(user: User) {
    const result = this.http.get(`${this.baseURL}/Ban/${user.userId}`)
      .toPromise();
        
    return result;
  }

  async ReactivateUser(user: User) {
    const result = this.http.get(`${this.baseURL}/Reactivate/${user.userId}`)
      .toPromise();
    return result;
  }
  /** PUT  **/ 

  /** DELETE  **/ 
  async deleteUser(id: number) {
    const result = await this.http.delete(`${this.baseURL}/Delete/${id}`).toPromise();
    return result;
  }

  async deleteAddress(addressId: number) {
    const result = await this.http.delete(`${this.baseURL}/Address/Delete/${addressId}`).toPromise();
    return result;
  }

  async deletePhone(phoneId: number) {
    const result = await this.http.delete(`${this.baseURL}/Phone/Delete/${phoneId}`).toPromise();
    return result
  }
  /** DELETE  **/ 

  /*** UPLOAD IMAGEM ***/
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    this.storage.upload(filePath, file);
  }
  /*** UPLOAD IMAGEM ***/


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
