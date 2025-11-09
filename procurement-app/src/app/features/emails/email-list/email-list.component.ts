import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { EmailService } from '../../../core/services/email.service';
import { EmailThread } from '../../../core/models/email.model';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    AgGridAngular
  ],
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {
  emails: EmailThread[] = [];
  loading = false;
  error: string | null = null;
  selectedFilter = 'recent';
  searchQuery = '';
  
  private gridApi!: GridApi;
  public theme = themeQuartz;

  public columnDefs: ColDef[] = [
    {
      field: 'poNumber',
      headerName: 'PO Number',
      width: 140,
      pinned: 'left',
      cellRenderer: (params: any) => {
        return `<span style="font-family: monospace; font-weight: 600; color: #6366f1;">${params.value}</span>`;
      }
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 2,
      minWidth: 250
    },
    {
      field: 'fromEmail',
      headerName: 'From',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'processingState',
      headerName: 'Status',
      width: 180,
      cellRenderer: (params: any) => {
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
        const color = colors[params.value] || '#64748b';
        const label = params.value.replace(/_/g, ' ');
        return `<span style="background: ${color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">${label}</span>`;
      }
    },
    {
      field: 'systemMessage',
      headerName: 'Type',
      width: 100,
      cellRenderer: (params: any) => {
        return params.value 
          ? '<span class="material-icons" style="color: #6366f1; font-size: 18px;">smart_toy</span>'
          : '<span class="material-icons" style="color: #64748b; font-size: 18px;">person</span>';
      }
    },
    {
      field: 'receivedAt',
      headerName: 'Received',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      headerName: 'Actions',
      width: 100,
      pinned: 'right',
      cellRenderer: () => {
        return `<button class="btn-action btn-view"><span class="material-icons btn-icon">visibility</span><span>View</span></button>`;
      },
      onCellClicked: (params) => {
        if (params.data) {
          this.viewThread(params.data.poNumber);
        }
      }
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(
    private emailService: EmailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    let request;
    switch (this.selectedFilter) {
      case 'recent':
        request = this.emailService.getRecentEmails(7);
        break;
      case 'procurement':
        request = this.emailService.getProcurementEmails();
        break;
      case 'pending':
        request = this.emailService.getEmailsByState('RECOMMENDATIONS_SENT');
        break;
      case 'completed':
        request = this.emailService.getEmailsByState('COMPLETION_SENT');
        break;
      default:
        request = this.emailService.getRecentEmails(7);
    }

    request.subscribe({
      next: (data) => {
        this.emails = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load emails';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadData();
      return;
    }

    this.loading = true;
    this.emailService.searchEmails(this.searchQuery).subscribe({
      next: (data) => {
        this.emails = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Search failed';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewThread(poNumber: string): void {
    this.router.navigate(['/emails/thread', poNumber]);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  refresh(): void {
    this.searchQuery = '';
    this.loadData();
  }
}
