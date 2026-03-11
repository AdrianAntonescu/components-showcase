import { Direction } from './direction.enum';

export interface SortChange {
  columnName: string;
  direction: Direction;
}

export interface PaginationChange {
  currentPage: number;
  pageSize: number | null;
}
