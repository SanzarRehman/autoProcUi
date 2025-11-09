import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { GLService } from '../../../core/services/gl.service';
import { GLEntry, GLStats } from '../../../core/models/procurement.model';

@Component({
  selector: 'app-gl-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    AgGridAngular
  ],
  templateUrl: './gl-list.component.html',
  styleUrl: './gl-list.component.scss'
})
export class GlListComponent implements OnInit {
  entries: GLEntry[] = [];
  stats: GLStats | null = null;
  loading = false;
  error: string | null = null;
  selectedFilter = 'all';
  
  private gridApi!: GridApi;
  public theme = themeQuartz;

  public columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      pinned: 'left'
    },
    {
      field: 'transactionType',
      headerName: 'Type',
      width: 130,
      cellRenderer: (params: any) => {
        const colors: any = {
          ALLOCATION: '#8b5cf6',
          PURCHASE: '#10b981'
        };
        const color = colors[params.value] || '#64748b';
        return `<span style="background: ${color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500;">${params.value}</span>`;
      }
    },
    {
      field: 'referenceNumber',
      headerName: 'Reference',
      width: 150,
      cellRenderer: (params: any) => {
        return `<span style="font-family: monospace; font-weight: 600; color: #6366f1;">${params.value}</span>`;
      }
    },
    {
      field: 'accountDebit',
      headerName: 'Debit Account',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'accountCredit',
      headerName: 'Credit Account',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      type: 'numericColumn',
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellStyle: { fontWeight: 600 }
    },
    {
      field: 'requesterEmail',
      headerName: 'Requester',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'transactionDate',
      headerName: 'Date',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(private glService: GLService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    let request;
    if (this.selectedFilter === 'all') {
      request = this.glService.getAllEntries();
    } else {
      request = this.glService.getEntriesByType(this.selectedFilter);
    }

    request.subscribe({
      next: (data) => {
        this.entries = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load GL entries';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadStats(): void {
    this.glService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      }
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  refresh(): void {
    this.loadData();
    this.loadStats();
  }
}
