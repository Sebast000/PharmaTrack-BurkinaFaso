import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSales } from './list-sales';

describe('ListSales', () => {
  let component: ListSales;
  let fixture: ComponentFixture<ListSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
