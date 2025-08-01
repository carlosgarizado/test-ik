import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectRoutePage } from './select-route.page';

describe('SelectRoutePage', () => {
  let component: SelectRoutePage;
  let fixture: ComponentFixture<SelectRoutePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
