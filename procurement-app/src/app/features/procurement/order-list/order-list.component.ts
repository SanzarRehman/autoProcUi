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
import { ProcurementService } from '../../../core/services/procurement.service';
import { PurchaseOrder, ProcurementStats } from '../../../core/models/procurement.model';

@Component({
  selector: 'app-order-list',
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
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  stats: ProcurementStats | null = null;
  loading = false;
  error: string | null = null;
  selectedStatus = 'all';
  
  private gridApi!: GridApi;
  public theme = themeQuartz;

  public columnDefs: ColDef[] = [
    {
      field: 'poNumber',
      headerName: 'PO Number',
      width: 150,
      pinned: 'left'
    },
    {
      field: 'itemName',
      headerName: 'Item',
      flex: 2,
      minWidth: 200
    },
    {
      field: 'itemType',
      headerName: 'Type',
      width: 120
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      cellRenderer: (params: any) => {
        const colors: any = {
          PENDING: '#f59e0b',
          APPROVED: '#10b981',
          REJECTED: '#ef4444',
          COMPLETED: '#6366f1'
        };
        const color = colors[params.value] || '#64748b';
        return `<span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">${params.value}</span>`;
      }
    },
    {
      field: 'requesterEmail',
      headerName: 'Requester',
      flex: 1,
      minWidth: 180
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(private procurementService: ProcurementService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const request = this.selectedStatus === 'all' 
      ? this.procurementService.getAllOrders()
      : this.procurementService.getOrdersByStatus(this.selectedStatus);

    request.subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load purchase orders';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadStats(): void {
    this.procurementService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onStatusChange(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
    this.loadStats();
  }
}
