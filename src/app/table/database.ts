import { HttpClient } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize = 10,
    query = ''
  ): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=${encodeURIComponent(
      query + ' ' + 'repo:angular/components'
    )}&sort=${sort}&order=${order}&page=${page + 1}&per_page=${pageSize}`;

    return this._httpClient.get<GithubApi>(requestUrl);
  }
}
