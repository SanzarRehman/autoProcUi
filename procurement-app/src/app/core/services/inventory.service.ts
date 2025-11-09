import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, InventoryStats } from '../models/procurement.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly apiUrl = '/pro/api/inventory';

  constructor(private http: HttpClient) {}

  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  getItemById(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }

  searchItems(type?: string, brand?: string): Observable<InventoryItem[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (brand) params = params.set('brand', brand);
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/search`, { params });
  }

  getStats(): Observable<InventoryStats> {
    return this.http.get<InventoryStats>(`${this.apiUrl}/stats`);
  }
}
