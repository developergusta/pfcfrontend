import { Phone } from './../../../models/Phone';
import { User } from './../../../models/User';
import { UsuarioService } from './../../../_services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EventoService } from 'src/app/_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editUsuarios',
  templateUrl: './editUsuarios.component.html',
  styleUrls: ['./editUsuarios.component.scss']
})
export class EditUsuariosAdminComponent implements OnInit {

  titulo = 'Editar Usuario';
  user = new User();
  imagemURL = 'assets/img/upload.png';
  userForm: FormGroup;
  file: File;
  fileNameToUpdate: string;

  dataAtual = '';

  get addresses(): FormArray {
    return <FormArray>this.userForm.get('addresses');
  }

  get phones(): FormArray {
    return <FormArray>this.userForm.get('phones');
  }

  constructor(private userService: UsuarioService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private router: ActivatedRoute) { }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();

  }

  carregarUsuario() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.userService.getUserById(idEvento)
      .then(
        (user: User) => {
          console.log(user)
          this.user = user;
          this.fileNameToUpdate = user.image.src.toString();

          this.imagemURL = `http://localhost:5000/resources/images/${this.user.image.src}?_ts=${this.dataAtual}`;

          this.user.image.src = '';
          this.userForm.patchValue(this.user);

          this.user.addresses.forEach(addr => {
            this.addresses.push(this.createAddress(addr));
          });
          this.user.phones.forEach(phone => {
            this.phones.push(this.createPhone(phone));
          });
        }
      );
  }

  validation() {
    this.userForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      cpf: ['', [Validators.required, Validators.maxLength(14)]],
      rg: ['', Validators.maxLength(13)],
      login: this.fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        pass: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
      }),
      image: this.fb.group({
        src: ['', [Validators.required]],
      }),
      addresses: this.fb.array([]),
      phones: this.fb.array([])
    });
  }

  createAddress(address: any): FormGroup{
    return this.fb.group({
      id: [address.id],
      street: [address.street, [Validators.required, Validators.maxLength(255)]],
      complement: [address.complement, [Validators.maxLength(255)]],
      zipCode: [address.zipCode, [Validators.maxLength(20)]],
      num: [address.num , [Validators.required, Validators.min(0), Validators.max(99999)]],
      country: [address.country, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]],
      state: [address.state, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      city: [address.city, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    });
  }

  createPhone(phone: any): FormGroup{
    return this.fb.group({
      id: [phone.id],
      number: [phone.number, [Validators.required, Validators.maxLength(255)]],
      type: [phone.type, [Validators.required, Validators.maxLength(255)]]
    });
  }

  adicionarEndereco() {
    this.addresses.push(this.createAddress({ id: 0 }));
  }

  adicionarTelefone() {
    this.phones.push(this.createPhone({ id: 0 }));
  }

  removerEndereco(id: number) {
    this.addresses.removeAt(id);
  }

  removerTelefone(id: number) {
    this.phones.removeAt(id);
  }

  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

  uploadImagem() {
    if (this.userForm.get('imagemURL').value !== '') {
      this.userService.postUpload(this.file, this.fileNameToUpdate)
        .then(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.user.image.src}?_ts=${this.dataAtual}`;
          }
        );
    }
  }

  salvarUsuario() {
    this.user = Object.assign({ id: this.user.userId }, this.userForm.value);
    this.user.image.src = this.fileNameToUpdate;

    this.uploadImagem();

    this.userService.updateUser(this.user).then(
      () => {
        this.toastr.success('Editado com Sucesso!');
      }).catch( error => {
        this.toastr.error(`Erro ao Editar: ${error}`);
      });
  }

}
