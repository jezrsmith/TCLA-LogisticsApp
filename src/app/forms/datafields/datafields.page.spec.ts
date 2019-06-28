import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatafieldsPage } from './datafields.page';

describe('DatafieldsPage', () => {
  let component: DatafieldsPage;
  let fixture: ComponentFixture<DatafieldsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatafieldsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafieldsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
