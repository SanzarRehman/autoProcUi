import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLEntry, GLStats } from '../models/procurement.model';

@Injectable({
  providedIn: 'root'
})
export class GLService {
  private readonly apiUrl = '/pro/api/gl';

  constructor(private http: HttpClient) {}

  getAllEntries(): Observable<GLEntry[]> {
    return this.http.get<GLEntry[]>(this.apiUrl);
  }

  getEntryById(id: number): Observable<GLEntry> {
    return this.http.get<GLEntry>(`${this.apiUrl}/${id}`);
  }

  getEntriesByReference(refNumber: string): Observable<GLEntry[]> {
    return this.http.get<GLEntry[]>(`${this.apiUrl}/reference/${refNumber}`);
  }

  getEntriesByType(type: string): Observable<GLEntry[]> {
    return this.http.get<GLEntry[]>(`${this.apiUrl}/type/${type}`);
  }

  getEntriesByRequester(email: string): Observable<GLEntry[]> {
    return this.http.get<GLEntry[]>(`${this.apiUrl}/requester/${email}`);
  }

  getRecentEntries(days: number = 30): Observable<GLEntry[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<GLEntry[]>(`${this.apiUrl}/recent`, { params });
  }

  getStats(): Observable<GLStats> {
    return this.http.get<GLStats>(`${this.apiUrl}/stats`);
  }
}
