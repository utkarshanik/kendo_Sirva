import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomColumnMenuComponent } from './custom-column-menu.component';

describe('CustomColumnMenuComponent', () => {
  let component: CustomColumnMenuComponent;
  let fixture: ComponentFixture<CustomColumnMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomColumnMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomColumnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
