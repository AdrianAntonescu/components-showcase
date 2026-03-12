import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GridComponent } from '../../shared/grid/grid.component';
import { ColumnComponent } from '../../shared/grid/components/column/column.component';
import { countries } from '../../../mocks/countries';
import { PaginationChange } from '../../shared/models/pagination-change.model';

@Component({
  selector: 't-demo',
  imports: [GridComponent, ColumnComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly countries = countries;

  performFetch(event: PaginationChange): void {
    console.log('Fetch data with params: ', event);
  }
}
