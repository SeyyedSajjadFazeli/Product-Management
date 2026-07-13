import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products/';

  constructor(private http: HttpClient) {
    console.log('✅ ProductService ساخته شد!');
  }

  // دریافت همه محصولات از بک‌اند
  getProducts(): Observable<Product[]> {
    console.log('🔄 دریافت محصولات از:', this.apiUrl);
    return this.http.get<Product[]>(this.apiUrl);
  }

  // دریافت یک محصول با شناسه
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}/`);
  }

  // ایجاد محصول جدید
  createProduct(product: Product): Observable<Product> {
    console.log('📤 ارسال محصول جدید:', product);
    return this.http.post<Product>(this.apiUrl, product);
  }

  // ویرایش محصول
  updateProduct(id: number, product: Product): Observable<Product> {
    console.log('📤 ویرایش محصول:', product);
    return this.http.put<Product>(`${this.apiUrl}${id}/`, product);
  }

  // حذف محصول
  deleteProduct(id: number): Observable<void> {
    console.log('🗑️ حذف محصول با شناسه:', id);
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
