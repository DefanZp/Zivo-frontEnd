import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersDetail } from './admin-orders-detail';

describe('AdminOrdersDetail', () => {
  let component: AdminOrdersDetail;
  let fixture: ComponentFixture<AdminOrdersDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdersDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrdersDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
