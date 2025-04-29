// filepath: c:\Users\UtkarshaNikam\Desktop\sirva_ui_Again\src\app\services\dataservie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../products';

@Injectable({
  providedIn: 'root',
})
export class DataservieService {
  private baseUrl = 'http://localhost:3000/products'; // JSON Server URL

  constructor(private http: HttpClient) {}

  // Get all products
  public products(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Add a new product
  public addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  // Update an existing product
  public updateProduct(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/${product.id}`;
    console.log('Updating product at URL:', url, 'with data:', product);
    return this.http.patch<Product>(url, product);
  }

  // Delete a product
  public removeProduct(product: Product): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${product.id}`);
  }
}