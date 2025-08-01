import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationRoutePage } from './confirmation-route.page';

describe('ConfirmationRoutePage', () => {
  let component: ConfirmationRoutePage;
  let fixture: ComponentFixture<ConfirmationRoutePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
