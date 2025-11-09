import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder, ProcurementStats } from '../models/procurement.model';

@Injectable({
  providedIn: 'root'
})
export class ProcurementService {
  private readonly apiUrl = '/pro/api/procurement';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }

  getOrderByPO(poNumber: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/${poNumber}`);
  }

  getOrdersByStatus(status: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrdersByRequester(email: string): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/requester/${email}`);
  }

  getStats(): Observable<ProcurementStats> {
    return this.http.get<ProcurementStats>(`${this.apiUrl}/stats`);
  }
}
