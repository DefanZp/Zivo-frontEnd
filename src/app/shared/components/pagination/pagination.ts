import { Component, computed, input, output } from '@angular/core';

type PageItem = number | '...';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {

  currentPage = input(1);
  lastPage = input(1);
  pageChange = output<number>();
  // untuk mengatasi race condition
  loading = input(false);

  visiblePage = computed<PageItem[]>(() => {
    
    const current = this.currentPage();
    const last = this.lastPage();

    if (last <= 7) {
      return Array.from(
        { length: last},
        (_, index) => index + 1
      );
    }

    if (current <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        '...',
        last
      ];
    }

    if (current >= last - 3) {
      return [
        1,
        '...',
        last - 4,
        last - 3,
        last - 2,
        last - 1,
        last
      ];
    }
    
    return [
      1,
      '...',
      current -1,
      current,
      current + 1,
      '...',
      last
    ];
  });

  goToPage(page: number): void {
    this.pageChange.emit(page);
  }

  goToPreviousPage(): void {

    if (this.currentPage() === 1) {
      return;
    }

    this.pageChange.emit(this.currentPage() -1 );
  }

  goToNextPage(): void {

    if (this.currentPage() === this.lastPage()) {
      return;
    }

    this.pageChange.emit(this.currentPage() +1 );
  }

  
}
