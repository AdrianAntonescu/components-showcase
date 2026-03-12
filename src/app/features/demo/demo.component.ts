import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { GridComponent } from '../../shared/grid/grid.component';
import { ColumnComponent } from '../../shared/grid/components/column/column.component';
import { countries } from '../../../mocks/countries';
import { PaginationChange } from '../../shared/models/pagination-change.model';
import { SortChange } from '../../shared/models/sort-change.model';
import { Direction } from '../../shared/models/direction.enum';
import { nbaPlayers } from '../../../mocks/nba-players';

interface Country {
  name: string;
  population: number;
  language: string;
  currency: string;
}

interface NbaPlayer {
  name: string;
  totalPoints: number;
  championshipsWon: number;
}

@Component({
  selector: 't-demo',
  imports: [GridComponent, ColumnComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly countries: Country[] = countries;
  readonly nbaPlayers: NbaPlayer[] = nbaPlayers;

  readonly countriesGridData = signal<Country[]>(this.countries);

  private currentPage = 1;
  private currentPageSize: number | null = null;
  private currentSort: SortChange | null = null;


  // In a real application, this would be replaced by a real API call
  // with pagination and sorting capabilities; for the puropose of this exercise
  // I believe this would be enough to demonstrate the grid functionality
  performFetch(event: PaginationChange | SortChange): void {
    if ('direction' in event) {
      this.currentSort = event;
    } else {
      this.currentPage = event.currentPage;
      this.currentPageSize = event.pageSize;
    }

    const sortedData = this.getSortedData();
    this.countriesGridData.set(this.getPaginatedData(sortedData));
  }

  private getSortedData(): Country[] {
    if (!this.currentSort || this.currentSort.direction === Direction.NONE) {
      return [...this.countries];
    }

    const { columnName, direction } = this.currentSort;
    const property = columnName as keyof Country;

    return [...this.countries].sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];

      const comparisonResult =
        typeof valueA === 'number' && typeof valueB === 'number'
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));

      return direction === Direction.ASC ? comparisonResult : -comparisonResult;
    });
  }

  private getPaginatedData(data: Country[]): Country[] {
    if (this.currentPageSize === null) {
      return data;
    }

    const start = (this.currentPage - 1) * this.currentPageSize;
    const end = this.currentPage * this.currentPageSize;

    return data.slice(start, end);
  }
}
