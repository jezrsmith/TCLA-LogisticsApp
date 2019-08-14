import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateflowComponent } from './createflow.component';

describe('CreateflowComponent', () => {
  let component: CreateflowComponent;
  let fixture: ComponentFixture<CreateflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
