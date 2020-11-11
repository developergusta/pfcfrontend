import { SectionsModule } from './../sections/sections.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateFormatPipePipe } from '../_helps/DateFormatPipe.pipe';
import { DateTimeFormatPipePipe } from '../_helps/DateTimeFormatPipe.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        SectionsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        ModalModule.forRoot(),
        NgxMaskModule.forRoot(),
    ],
    declarations: [
      HomeComponent,
      DateFormatPipePipe,
      DateTimeFormatPipePipe ],
    exports: [
      HomeComponent,
      DateFormatPipePipe,
      DateTimeFormatPipePipe
    ],
    providers: []
})
export class HomeModule { }
