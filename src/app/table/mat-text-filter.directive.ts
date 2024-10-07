import { EventEmitter, HostListener } from '@angular/core';
import { Directive } from '@angular/core';

export class MatTextFilter {
  private _term = '';
  public get term() {
    return this._term;
  }
  public set term(value) {
    this._term = value;
    this.textFilterChange.emit(value);
  }
  textFilterChange = new EventEmitter<string>();
}

@Directive({
  selector: 'input[matTextFilter]',
  exportAs: 'matTextFilter',
  standalone: true,
})
export class MatTextFilterDirective {
  matTextFilter = new MatTextFilter();

  @HostListener('change', ['$event.target.value'])
  onChange(value: string) {
    this.matTextFilter.term = value;
  }
}
