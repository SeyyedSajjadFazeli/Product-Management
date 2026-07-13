import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = { name: '', price: 0 };
  isEditing = false;
  loading = false;
  errorMessage = '';
  showForm = false;
  submitted = false;

  // دسته‌بندی‌های پیش‌فرض به صورت تگ
  predefinedCategories: string[] = [
    'الکترونیک', 'موبایل', 'صوتی', 'کامپیوتر',
    'پوشاک', 'کتاب', 'ورزشی', 'خودرو',
    'کیک و شیرینی', 'لوازم خانگی', 'متفرقه'
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ خطا در دریافت محصولات:', error);
        this.errorMessage = 'خطا در دریافت محصولات! لطفاً دوباره تلاش کنید.';
        this.loading = false;
      }
    });
  }

  saveProduct(): void {
    this.submitted = true;

    if (!this.currentProduct.name || !this.currentProduct.name.trim()) {
      return;
    }

    if (!this.currentProduct.price || this.currentProduct.price <= 0) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditing && this.currentProduct.id) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('❌ خطا در ویرایش محصول:', error);
            this.errorMessage = 'خطا در ویرایش محصول!';
            this.loading = false;
          }
        });
    } else {
      this.productService.createProduct(this.currentProduct)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('❌ خطا در ایجاد محصول:', error);
            this.errorMessage = 'خطا در ایجاد محصول!';
            this.loading = false;
          }
        });
    }
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditing = true;
    this.showForm = true;
    this.submitted = false;
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: number): void {
    if (!id) {
      console.error('❌ شناسه محصول معتبر نیست');
      return;
    }

    if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
      this.loading = true;
      this.errorMessage = '';
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ خطا در حذف محصول:', error);
          this.errorMessage = 'خطا در حذف محصول!';
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.currentProduct = { name: '', price: 0 };
    this.isEditing = false;
    this.submitted = false;
    this.errorMessage = '';
  }

  openAddForm(): void {
    this.resetForm();
    this.showForm = true;
    this.submitted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  // انتخاب/لغو انتخاب دسته‌بندی تگ
  selectCategory(category: string): void {
    if (this.currentProduct.category === category) {
      this.currentProduct.category = ''; // اگر تگ قبلاً انتخاب شده بود، لغو شود
    } else {
      this.currentProduct.category = category; // تگ جدید انتخاب شود
    }
  }

  getCategoryColor(category: string | undefined): string {
    const colors: { [key: string]: string } = {
      'الکترونیک': '#667eea',
      'موبایل': '#48bb78',
      'صوتی': '#ed8936',
      'کامپیوتر': '#9f7aea',
      'پوشاک': '#fc8181',
      'کتاب': '#68d391',
      'ورزشی': '#f6ad55',
      'خودرو': '#a0aec0'
    };
    return colors[category || ''] || '#a0aec0';
  }
}
