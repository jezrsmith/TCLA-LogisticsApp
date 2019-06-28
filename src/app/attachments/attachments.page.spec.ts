import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsPage } from './attachments.page';

describe('AttachmentsPage', () => {
  let component: AttachmentsPage;
  let fixture: ComponentFixture<AttachmentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
