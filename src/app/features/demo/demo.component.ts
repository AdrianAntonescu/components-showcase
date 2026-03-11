import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GridComponent } from '../../common/grid/grid.component';
import { ColumnComponent } from '../../common/grid/components/column/column.component';
import { countries } from '../../../mocks/countries';

@Component({
  selector: 't-demo',
  imports: [GridComponent, ColumnComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly countries = countries;
}
