import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { GithubIssue, ExampleHttpDatabase } from './database';
import { signal } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

// TODO: Replace this with your own data model type
export interface TableItem extends GithubIssue {}

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableItem> {
  data: TableItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  database: ExampleHttpDatabase | undefined;
  textFilter: FormControl<string | null> | undefined;
  resultsLength = signal(0);
  isLoadingResults = signal(true);
  isRateLimitReached = signal(false);
  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableItem[]> {
    if (this.paginator && this.sort && this.database && this.textFilter) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.paginator.page,
        this.sort.sortChange,
        this.textFilter.valueChanges
      ).pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.database!.getRepoIssues(
            this.sort!.active,
            this.sort!.direction,
            this.paginator!.pageIndex,
            this.paginator!.pageSize,
            this.textFilter!.value ?? ''
          ).pipe(
            catchError(() => observableOf({ items: [], total_count: 0 })),
            map((data) => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults.set(false);
              this.isRateLimitReached.set(data === null);
              this.resultsLength.set(data.total_count);
              return data.items;
            })
          );
        })
      );
    } else {
      throw Error(
        'Please set the paginator, sort and database on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}
}
