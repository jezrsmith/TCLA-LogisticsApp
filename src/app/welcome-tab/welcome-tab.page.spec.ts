import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeTabPage } from './welcome-tab.page';

describe('Tab2Page', () => {
  let component: WelcomeTabPage;
  let fixture: ComponentFixture<WelcomeTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
