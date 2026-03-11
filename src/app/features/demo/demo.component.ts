import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GridComponent } from '../../common/datagrid/components/grid/grid.component';
import { ColumnComponent } from '../../common/datagrid/components/column/column.component';

@Component({
  selector: 't-demo',
  imports: [GridComponent, ColumnComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly countries = [
    {
      name: 'Japan',
      population: 125_000_000,
      language: 'Japanese',
      currency: 'Japanese Yen (JPY)',
    },
    {
      name: 'Germany',
      population: 83_000_000,
      language: 'German',
      currency: 'Euro (EUR)',
    },
    {
      name: 'Brazil',
      population: 214_000_000,
      language: 'Portuguese',
      currency: 'Brazilian Real (BRL)',
    },
    {
      name: 'Canada',
      population: 39_000_000,
      language: 'English, French',
      currency: 'Canadian Dollar (CAD)',
    },
    {
      name: 'Australia',
      population: 26_000_000,
      language: 'English',
      currency: 'Australian Dollar (AUD)',
    },
    {
      name: 'India',
      population: 1_420_000_000,
      language: 'Hindi, English',
      currency: 'Indian Rupee (INR)',
    },
    {
      name: 'France',
      population: 68_000_000,
      language: 'French',
      currency: 'Euro (EUR)',
    },
    {
      name: 'South Korea',
      population: 52_000_000,
      language: 'Korean',
      currency: 'South Korean Won (KRW)',
    },
    {
      name: 'Mexico',
      population: 128_000_000,
      language: 'Spanish',
      currency: 'Mexican Peso (MXN)',
    },
    {
      name: 'Egypt',
      population: 112_000_000,
      language: 'Arabic',
      currency: 'Egyptian Pound (EGP)',
    },
  ];
}
