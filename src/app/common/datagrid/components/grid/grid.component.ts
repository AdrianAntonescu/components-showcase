import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { isObservable, Observable, of, switchMap } from 'rxjs';

import { PaginationChange, SortChange } from '../../models/datagrid.models';
import { ColumnComponent } from '../column/column.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

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

  readonly sortChange = output<SortChange>();
  readonly paginationChange = output<PaginationChange>();

  readonly columns = contentChildren(ColumnComponent);

  readonly gridData = toSignal(
    toObservable(this.data).pipe(
      switchMap((data) => (isObservable(data) ? data : of(data))),
    ),
    { initialValue: [] as T[] },
  );

  getCellData(row: T, column: ColumnComponent<T>): T[keyof T] {
    return row[column.property()];
  }
}
