import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryItem, InventoryStats } from '../../../core/models/procurement.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    AgGridAngular
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  items: InventoryItem[] = [];
  stats: InventoryStats | null = null;
  loading = false;
  error: string | null = null;
  selectedType = 'all';
  
  private gridApi!: GridApi;
  public theme = themeQuartz;

  public columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'Item ID',
      width: 120,
      pinned: 'left'
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      minWidth: 200
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      cellRenderer: (params: any) => {
        const colors: any = {
          laptop: '#6366f1',
          monitor: '#14b8a6',
          accessory: '#f59e0b'
        };
        const color = colors[params.value] || '#64748b';
        return `<span style="background: ${color}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">${params.value}</span>`;
      }
    },
    {
      field: 'availableQuantity',
      headerName: 'Available',
      width: 120,
      cellStyle: { textAlign: 'center', fontWeight: '600' }
    },
    {
      field: 'bookValue',
      headerName: 'Book Value',
      width: 130,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'specifications',
      headerName: 'Specifications',
      flex: 1,
      minWidth: 200,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return Object.entries(params.value)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
      }
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const request = this.selectedType === 'all' 
      ? this.inventoryService.getAllItems()
      : this.inventoryService.searchItems(this.selectedType);

    request.subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load inventory items';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadStats(): void {
    this.inventoryService.getStats().subscribe({
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

  onTypeChange(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
    this.loadStats();
  }
}
