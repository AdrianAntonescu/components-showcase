import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { PaginationChange } from '../../../../models/pagination-change.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 't-paginator',
  imports: [FormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  readonly totalItems = input.required<number>();
  readonly pageSize = model<number | null>(null);
  readonly pageSizeOptions = input<number[]>([5, 10, 20]);

  readonly paginationChange = output<PaginationChange>();

  readonly currentPage = signal(1);
  readonly selectedPageSizeOption = computed<number>(() => {
    return this.pageSize() ?? this.maxPageSizeOption();
  });
  readonly canGoBack = computed<boolean>(() => this.currentPage() > 1);
  readonly canGoForward = computed<boolean>(
    () => this.currentPage() < this.totalPages(),
  );
  readonly totalPages = computed<number>(() => {
    return Math.max(1, Math.ceil(this.totalItems() / this.actualPageSize()));
  });

  private readonly actualPageSize = computed<number>(() => {
    return this.pageSize() ?? this.totalItems();
  });
  private readonly maxPageSizeOption = computed<number>(() => {
    return Math.max(...this.pageSizeOptions());
  });

  onGoBack(): void {
    this.setPage(this.currentPage() - 1);
  }

  onGoForward(): void {
    this.setPage(this.currentPage() + 1);
  }

  onPageSizeChange(event: Event): void {
    const selectedSize = parseInt((event.target as HTMLSelectElement).value);

    if (Number.isNaN(selectedSize) || selectedSize <= 0) {
      return;
    }

    if (selectedSize === this.actualPageSize()) {
      return;
    }

    this.pageSize.set(selectedSize);
    this.currentPage.set(1);
    this.emitPaginationChange();
  }

  private setPage(nextPage: number): void {
    if (nextPage === this.currentPage()) {
      return;
    }

    this.currentPage.set(nextPage);
    this.emitPaginationChange();
  }

  private emitPaginationChange(): void {
    this.paginationChange.emit({
      currentPage: this.currentPage(),
      pageSize: this.actualPageSize(),
    });
  }
}
