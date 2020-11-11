import { CategoriesSectionComponent } from './categories-section/categories-section.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsSectionComponent } from './alerts-section/alerts-section.component';
import { SectionsComponent } from './sections.component';
import { ButtonsSectionComponent } from './buttons-section/buttons-section.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AlertsSectionComponent,
    SectionsComponent,
    ButtonsSectionComponent,
    CategoriesSectionComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [ SectionsComponent ]
})
export class SectionsModule { }
