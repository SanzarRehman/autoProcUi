import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailService } from '../../../core/services/email.service';
import { EmailThread, EmailThreadHierarchy, ThreadStats } from '../../../core/models/email.model';

@Component({
  selector: 'app-email-thread',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './email-thread.component.html',
  styleUrl: './email-thread.component.scss'
})
export class EmailThreadComponent implements OnInit {
  poNumber: string = '';
  hierarchy: EmailThreadHierarchy[] = [];
  stats: ThreadStats | null = null;
  loading = false;
  error: string | null = null;
  showHtmlContent: Map<number, boolean> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.poNumber = params['poNumber'];
      if (this.poNumber) {
        this.loadThread();
      }
    });
  }

  loadThread(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.emailService.getThreadHierarchy(this.poNumber).toPromise(),
      this.emailService.getThreadStats(this.poNumber).toPromise()
    ]).then(([hierarchy, stats]) => {
      this.hierarchy = hierarchy || [];
      this.stats = stats || null;
      this.loading = false;
    }).catch(err => {
      this.error = 'Failed to load email thread';
      this.loading = false;
      console.error(err);
    });
  }

  goBack(): void {
    this.router.navigate(['/emails']);
  }

  refresh(): void {
    this.loadThread();
  }

  getStateColor(state: string): string {
    const colors: any = {
      EMAIL_RECEIVED: '#94a3b8',
      CLASSIFIED: '#3b82f6',
      RECOMMENDATIONS_SENT: '#f59e0b',
      CONFIRMATION_RECEIVED: '#8b5cf6',
      PO_GENERATED: '#10b981',
      COMPLETION_SENT: '#6366f1',
      NOT_PROCUREMENT: '#64748b',
      ERROR: '#ef4444'
    };
    return colors[state] || '#64748b';
  }

  getStateLabel(state: string): string {
    return state.replace(/_/g, ' ');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getEmailIcon(email: EmailThread): string {
    return email.systemMessage ? 'smart_toy' : 'person';
  }

  getEmailIconColor(email: EmailThread): string {
    return email.systemMessage ? '#6366f1' : '#64748b';
  }

  /**
   * Toggle between HTML and plain text view for an email
   */
  toggleHtmlView(emailId: number): void {
    this.showHtmlContent.set(emailId, !this.showHtmlContent.get(emailId));
  }

  /**
   * Check if HTML view is enabled for an email
   */
  isHtmlViewEnabled(emailId: number): boolean {
    return this.showHtmlContent.get(emailId) || false;
  }

  /**
   * Sanitize HTML content for safe rendering
   */
  getSanitizedHtml(rawContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(rawContent);
  }
}
