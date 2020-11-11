import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTicketComponent } from './select-ticket.component';

describe('SelectTicketComponent', () => {
  let component: SelectTicketComponent;
  let fixture: ComponentFixture<SelectTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
