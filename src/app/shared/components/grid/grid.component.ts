import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { isObservable, Observable, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { ColumnComponent } from './components/column/column.component';
import { Direction } from '../../models/direction.enum';
import { SortChange } from '../../models/sort-change.model';
import { PaginationChange } from '../../models/pagination-change.model';
import { PaginatorComponent } from './components/paginator/paginator.component';

@Component({
  selector: 't-grid',
  imports: [PaginatorComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent<T> implements OnInit {
  readonly data = input.required<T[] | Observable<T[]>>();
  readonly sortable = input<boolean>(false);
  readonly pageSize = input<number | null>(null);
  readonly gridDataLength = input<number | null>(null);

  readonly sortChange = output<SortChange>();
  readonly paginationChange = output<PaginationChange>();

  readonly columns = contentChildren(ColumnComponent);
  readonly SORT_DIRECTION = Direction;

  // Data received as input
  readonly gridData = toSignal(
    toObservable(this.data).pipe(
      switchMap((data) => (isObservable(data) ? data : of(data))),
    ),
    { initialValue: [] as T[] },
  );

  private readonly activeSort = signal<SortChange | null>(null);
  readonly pageSizeOptions = computed<number[]>(() => {
    const totalSize = this.gridDataLength() ?? this.gridData().length;

    return Array.from(
      { length: Math.ceil(totalSize / 5) },
      (_, i) => (i + 1) * 5,
    );
  });
  readonly actualPageSize = computed<number>(() => {
    return this.pageSize() ?? this.gridDataLength() ?? this.gridData().length;
  });

  ngOnInit(): void {

    this.onPaginationChange({
      currentPage: 1,
      pageSize: this.actualPageSize(),
    });
  }

  getCellData(row: T, column: ColumnComponent<T>): string {
    const cellValue = row[column.property()];

    if (typeof cellValue === 'number') {
      return new Intl.NumberFormat().format(cellValue);
    }

    return String(cellValue);
  }

  isColumnSortable(column: ColumnComponent<T>): boolean {
    return this.sortable() && column.sortable();
  }

  getColumnSortDirection(column: ColumnComponent<T>): Direction {
    const currentSort = this.activeSort();

    if (!currentSort || currentSort.columnName !== column.name()) {
      return Direction.NONE;
    }

    return currentSort.direction;
  }

  onSort(column: ColumnComponent<T>): void {
    if (!this.isColumnSortable(column)) {
      return;
    }

    const columnName = column.name();
    const currentSort = this.activeSort();
    const direction: Direction =
      currentSort?.columnName === columnName
        ? this.getNextSortingDirection(currentSort.direction)
        : Direction.ASC;

    this.activeSort.set({ columnName, direction });
    this.sortChange.emit({ columnName, direction });
  }

  onPaginationChange(pagination: PaginationChange): void {
    this.paginationChange.emit(pagination);
  }

  private getNextSortingDirection(currentDirection: Direction): Direction {
    if (currentDirection === Direction.ASC) {
      return Direction.DESC;
    } else if (currentDirection === Direction.DESC) {
      return Direction.NONE;
    }

    return Direction.ASC;
  }
}
