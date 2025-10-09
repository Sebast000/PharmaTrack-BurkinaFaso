import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedicines } from './list-medicines';

describe('ListMedicines', () => {
  let component: ListMedicines;
  let fixture: ComponentFixture<ListMedicines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMedicines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMedicines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
