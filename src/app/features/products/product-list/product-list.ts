import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Product } from '../../../core/services/product/product';
import { Product as ProductModel } from '../../../core/models/product/product.model';
import { RouterLink } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Category as CategoryModel } from '../../../core/models/product/category.model';
import { Category } from '../../../core/services/category/category';
import { Pagination } from '../../../shared/components/pagination/pagination';


interface sortOption {
  label: string;
  sort: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    Loading,
    CommonModule,
    EmptyState,
    ReactiveFormsModule,
    CurrencyPipe,
    Pagination,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  
  private productService = inject(Product);
  private categoryService = inject(Category);
  private formBuilder = inject(NonNullableFormBuilder);

  products = signal<ProductModel[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  totalProduct = signal(0);
  categories = signal<CategoryModel[]>([]);

  // state pagination
  currentPage = signal(1);
  lastPage = signal(1);

  // daftar pilihan sort
  sortOptions: sortOption[] = [
    { label: 'Latest', sort: 'created_at', direction: 'desc'},
    { label: 'Lowest Price' , sort: 'price', direction: 'asc'},
    { label: 'Highest Price', sort: 'price', direction: 'desc'},
    { label: 'Name A-Z', sort: 'name', direction: 'asc'},
    { label: 'Name Z-A', sort: 'name', direction: 'desc'},
  ]

  searchForm = this.formBuilder.group({
    search: [''],
    category: [''],
    sortIndex: [0],
  });

  ngOnInit(): void {

    this.loadProducts();
    this.loadCategory();

    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.currentPage.set(1);
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage.set('Failed to load products. Please try again.');
        }
      })
  }

  loadProducts(
    search: string = '', 
    category?: number,
    sort: string = '', 
    direction: string = '', 
    page: number = 1
  ): void {

    this.loading.set(true);

    const formValue = this.searchForm.getRawValue();

    const selectedSort = this.sortOptions[Number(formValue.sortIndex ?? 0)];

    const selectedCategory = formValue.category ? Number(formValue.category) : undefined;

    this.productService
    .getProducts({
      search: formValue.search, 
      category: selectedCategory,
      sort:  selectedSort.sort, 
      direction: selectedSort.direction, 
      page: this.currentPage()
    })
    .subscribe({
      next: (response) => {
        this.products.set(response.data.data);

        this.currentPage.set(response.data.current_page);
        this.lastPage.set(response.data.last_page);
        this.totalProduct.set(response.data.total);

        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load products. Please try again.');

        this.loading.set(false);
      }
    })
  }

  goToPage(page: number): void {
    
    this.currentPage.set(page);

    this.loadProducts();
    this.scrollToProducts();
  }


  loadCategory(): void {

    this.categoryService
    .getCategories()
    .subscribe({
      next: (response) => {
        this.categories.set(response.data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // section untuk scroll ketika ubah pagination
  productSection = viewChild<ElementRef>('productSection');

  private scrollToProducts(): void {
    const element = this.productSection()?.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

}
