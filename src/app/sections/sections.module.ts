import { CategoriesSectionComponent } from './categories-section/categories-section.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsSectionComponent } from './alerts-section/alerts-section.component';
import { SectionsComponent } from './sections.component';
import { ButtonsSectionComponent } from './buttons-section/buttons-section.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturedSectionComponent } from './featured-section/featured-section.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AlertsSectionComponent,
    SectionsComponent,
    ButtonsSectionComponent,
    CategoriesSectionComponent,
    FeaturedSectionComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule 
  ],
  exports: [ SectionsComponent ]
})
export class SectionsModule { }
