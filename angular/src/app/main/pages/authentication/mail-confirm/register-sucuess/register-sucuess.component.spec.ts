import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSucuessComponent } from './register-sucuess.component';

describe('RegisterSucuessComponent', () => {
  let component: RegisterSucuessComponent;
  let fixture: ComponentFixture<RegisterSucuessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSucuessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSucuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
