import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 't-column',
  imports: [],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent<T> {
  readonly name = input.required<string>();
  readonly property = input.required<keyof T>();
  readonly sortable = input<boolean>(false);
}
