import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatamanageComponent } from './datamanage.component';

describe('DatamanageComponent', () => {
  let component: DatamanageComponent;
  let fixture: ComponentFixture<DatamanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatamanageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatamanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
