import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailThread, EmailThreadHierarchy, ThreadStats } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly apiUrl = '/pro/api/emails';

  constructor(private http: HttpClient) {}

  getEmailsByPO(poNumber: string): Observable<EmailThread[]> {
    return this.http.get<EmailThread[]>(`${this.apiUrl}/po/${poNumber}`);
  }

  getThreadHierarchy(poNumber: string): Observable<EmailThreadHierarchy[]> {
    return this.http.get<EmailThreadHierarchy[]>(`${this.apiUrl}/po/${poNumber}/hierarchy`);
  }

  getThreadStats(poNumber: string): Observable<ThreadStats> {
    return this.http.get<ThreadStats>(`${this.apiUrl}/po/${poNumber}/stats`);
  }

  getEmailsBySender(email: string): Observable<EmailThread[]> {
    return this.http.get<EmailThread[]>(`${this.apiUrl}/sender/${email}`);
  }

  getProcurementEmails(): Observable<EmailThread[]> {
    return this.http.get<EmailThread[]>(`${this.apiUrl}/procurement`);
  }

  getEmailsByState(state: string): Observable<EmailThread[]> {
    return this.http.get<EmailThread[]>(`${this.apiUrl}/state/${state}`);
  }

  getRecentEmails(days: number = 7): Observable<EmailThread[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<EmailThread[]>(`${this.apiUrl}/recent`, { params });
  }

  getAllPONumbers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/po-numbers`);
  }

  searchEmails(query: string): Observable<EmailThread[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<EmailThread[]>(`${this.apiUrl}/search`, { params });
  }
}
