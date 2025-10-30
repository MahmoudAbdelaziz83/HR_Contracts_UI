import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffContractComponent } from './staff-contract.component';

describe('StaffContractComponent', () => {
  let component: StaffContractComponent;
  let fixture: ComponentFixture<StaffContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
