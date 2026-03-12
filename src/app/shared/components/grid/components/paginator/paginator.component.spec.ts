import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the max page size option when pageSize is null', () => {
    fixture.componentRef.setInput('totalItems', 15);
    fixture.componentRef.setInput('pageSizeOptions', [5, 10, 20]);
    fixture.componentRef.setInput('pageSize', null);
    fixture.detectChanges();

    const select: HTMLSelectElement =
      fixture.nativeElement.querySelector('#pageSize');

    expect(select.value).toBe('20');
  });
});
