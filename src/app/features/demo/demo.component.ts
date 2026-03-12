import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';

import { GridComponent } from '../../shared/components/grid/grid.component';
import { ColumnComponent } from '../../shared/components/grid/components/column/column.component';
import { ProgressComponent } from '../../shared/components/progress/progress.component';
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
  imports: [GridComponent, ColumnComponent, ProgressComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent implements OnInit {
  readonly countries: Country[] = countries;
  readonly nbaPlayers: NbaPlayer[] = nbaPlayers;

  readonly countriesGridData = signal<Country[]>(this.countries);
  readonly nbaGridData = signal<NbaPlayer[]>(this.nbaPlayers);
  readonly progressComplete = signal(false);
  readonly progress = signal(0);

  private countriesCurrentPage = 1;
  private countriesCurrentPageSize: number | null = null;
  private countriesCurrentSort: SortChange | null = null;

  private nbaPlayersCurrentPage = 1;
  private nbaPlayersCurrentPageSize: number | null = null;

  ngOnInit() {
    // Simulate progress for the first grid
    const interval = setInterval(() => {
      this.progress.update((value) => {
        if (value === 100) {
          clearInterval(interval);
        }
        
        return value + 10;
      });
    }, 500);
  }

  // In a real application, this would be replaced by a real API call
  // with pagination and sorting capabilities; for the puropose of this exercise
  // I believe this would be enough to demonstrate the grid functionality
  performFetch(event: PaginationChange | SortChange): void {
    if ('direction' in event) {
      this.countriesCurrentSort = event;
    } else {
      this.countriesCurrentPage = event.currentPage;
      this.countriesCurrentPageSize = event.pageSize;
    }

    const sortedData = this.getSortedData();
    this.countriesGridData.set(
      this.getPaginatedData(
        sortedData,
        this.countriesCurrentPage,
        this.countriesCurrentPageSize,
      ),
    );
  }

  performNbaPlayersFetch(event: PaginationChange): void {
    this.nbaPlayersCurrentPage = event.currentPage;
    this.nbaPlayersCurrentPageSize = event.pageSize;

    this.nbaGridData.set(
      this.getPaginatedData(
        this.nbaPlayers,
        this.nbaPlayersCurrentPage,
        this.nbaPlayersCurrentPageSize,
      ),
    );
  }

  onProgressComplete(): void {
    this.progressComplete.set(true);
  }

  private getSortedData(): Country[] {
    if (
      !this.countriesCurrentSort ||
      this.countriesCurrentSort.direction === Direction.NONE
    ) {
      return [...this.countries];
    }

    const { columnName, direction } = this.countriesCurrentSort;
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

  private getPaginatedData<T>(
    data: T[],
    currentPage: number,
    pageSize: number | null,
  ): T[] {
    if (pageSize === null) {
      return data;
    }

    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;

    return data.slice(start, end);
  }
}
