import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
  computed,
} from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExampleHttpDatabase } from './database';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTextFilterDirective } from './mat-text-filter.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTextFilterDirective,
  ],
})
export class TableComponent implements AfterViewInit {
  private _httpClient = inject(HttpClient);
  private database = new ExampleHttpDatabase(this._httpClient);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTextFilterDirective) textFilter!: MatTextFilterDirective;
  @ViewChild(MatTable) table!: MatTable<TableItem>;
  dataSource: TableDataSource;
  resultsLength = signal(0);
  isLoadingResults = signal(false);
  isRateLimitReached = signal(false);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['created', 'state', 'number', 'title'];

  constructor() {
    this.dataSource = new TableDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.textFilter = this.textFilter.matTextFilter;
    this.dataSource.database = this.database;

    this.table.dataSource = this.dataSource;
    this.resultsLength = this.dataSource.resultsLength;
    this.isLoadingResults = this.dataSource.isLoadingResults;
    this.isRateLimitReached = this.dataSource.isRateLimitReached;
  }
}
