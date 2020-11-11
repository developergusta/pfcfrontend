import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { add } from 'ngx-bootstrap/chronos';

@Injectable({
  providedIn: 'root'
})
export class CorreiosService {

  private http: HttpClient;
  enderecoBuscado: any;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  async consultaCep(cep: any) {

    try {
      cep = cep.replace(/\D/g, '');

      if (cep !== '') {
        const validaCep = /^[0-9]{8}$/;

        if (validaCep.test(cep)) {
          return await this.http.get<any>(`https://viacep.com.br/ws/${cep}/json`).toPromise();
        }
      }
    } catch (error) {
      console.log(error);
    }

  }

}
