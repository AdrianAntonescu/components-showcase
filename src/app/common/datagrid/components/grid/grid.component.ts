import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
} from '@angular/core';
import { isObservable, Observable, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { ColumnComponent } from '../column/column.component';
import { Direction } from '../../models/direction.enum';
import { SortChange } from '../../models/sort-change.model';
import { PaginationChange } from '../../models/pagination-change.model';

@Component({
  selector: 't-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent<T> {
  readonly data = input.required<T[] | Observable<T[]>>();
  readonly sortable = input<boolean>(false);
  readonly pageSize = input<number | null>(null);

  // It is unclear from the requirements why we need a sortChange event emitter
  // because the component can handle data sorting internally
  // -- is it to send sorted data to the table if the pagination is server-side?
  readonly sortChange = output<SortChange>();
  readonly paginationChange = output<PaginationChange>();

  readonly columns = contentChildren(ColumnComponent);
  readonly SORT_DIRECTION = Direction;

  private readonly rawGridData = toSignal(
    toObservable(this.data).pipe(
      switchMap((data) => (isObservable(data) ? data : of(data))),
    ),
    { initialValue: [] as T[] },
  );

  private readonly activeSort = signal<SortChange | null>(null);
  readonly gridData = computed(() => {
    const sort = this.activeSort();

    if (!sort || sort.direction === Direction.NONE) {
      return this.rawGridData();
    }

    const columnName = sort.columnName as keyof T;
    const direction = sort.direction;

    return this.rawGridData().toSorted((rowA: T, rowB: T) => {
      return this.compareValues(rowA[columnName], rowB[columnName], direction);
    });
  });

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

  private getNextSortingDirection(currentDirection: Direction): Direction {
    if (currentDirection === Direction.ASC) {
      return Direction.DESC;
    } else if (currentDirection === Direction.DESC) {
      return Direction.NONE;
    }

    return Direction.ASC;
  }

  private compareValues(
    valueA: unknown,
    valueB: unknown,
    direction: Direction,
  ): number {
    const comparisonResult =
      typeof valueA === 'number' && typeof valueB === 'number'
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

    return direction === Direction.ASC ? comparisonResult : -comparisonResult;
  }
}
