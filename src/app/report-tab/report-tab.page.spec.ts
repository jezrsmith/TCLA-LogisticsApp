import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTabPage } from './report-tab.page';

describe('Tab1Page', () => {
  let component: ReportTabPage;
  let fixture: ComponentFixture<ReportTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
