import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  GridApi,
} from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { Task } from '../../../core/models/task.model';

/**
 * Reusable TaskGrid component with AG Grid integration
 * Displays tasks with sorting, filtering, and infinite scroll pagination
 */
@Component({
  selector: 'app-task-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss'],
})
export class TaskGridComponent implements OnInit {
  /**
   * Data source function that fetches tasks with pagination
   * Should return an observable or promise with TaskResponse
   */
  @Input() dataSource!: (offset: number, limit: number) => Promise<{ rows: Task[]; lastRow: number }>;

  /**
   * Event emitted when the View button is clicked on a task row
   */
  @Output() viewTask = new EventEmitter<Task>();

  /**
   * Loading state indicator
   */
  @Input() loading = false;

  /**
   * Filter code value (e.g., "ProcurementAutomation")
   */
  @Input() filterCode: string = '';

  /**
   * AG Grid API reference
   */
  private gridApi!: GridApi;

  /**
   * AG Grid theme (v34+ Theming API)
   */
  public theme = themeQuartz;

  /**
   * Default column definitions with sorting and filtering enabled
   */
  public defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    flex: 1,
    minWidth: 100,
    suppressMovable: true,
  };

  /**
   * Column definitions for all task fields with proper formatting
   */
  public columnDefs: ColDef[] = [
    {
      field: 'title',
      headerName: 'Task Title',
      flex: 2,
      minWidth: 300,
      wrapText: false,
      autoHeight: false,
      cellRenderer: (params: any) => {
        if (!params.data) return '';
        const title = params.value || 'N/A';
        const ref = params.data.ref || '';
        const module = params.data.module ? params.data.module.toUpperCase() : '';
        return `
          <div class="task-title-cell">
            <div class="task-title">${title}</div>
            <div class="task-meta">
              <span class="task-ref">Ref: ${ref}</span>
              <span class="task-module">${module}</span>
            </div>
          </div>
        `;
      },
    },
    {
      field: 'stepName',
      headerName: 'Step',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `
          <div class="step-badge">
            <span class="material-icons step-icon">assignment</span>
            <span>${params.value || ''}</span>
          </div>
        `;
      },
    },
    {
      field: 'initiator',
      headerName: 'Initiator',
      flex: 1,
      minWidth: 130,
      cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `
          <div class="user-cell">
            <span class="material-icons user-icon">person</span>
            <span>${params.value || ''}</span>
          </div>
        `;
      },
    },
    {
      field: 'startedAt',
      headerName: 'Started At',
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => {
        if (!params.data) return '';
        return this.formatDate(params.value);
      },
    },
    {
      headerName: 'Actions',
      width: 120,
      minWidth: 120,
      pinned: 'right',
      lockPosition: true,
      cellClass: 'action-cell',
      suppressMovable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return '';
        return `
          <button class="btn-action btn-view" title="View Details">
            <span class="material-icons btn-icon">visibility</span>
            <span class="btn-text">View</span>
          </button>
        `;
      },
      onCellClicked: (params) => {
        if (params.data) {
          this.onViewClick(params.data);
        }
      },
    },
  ];

  /**
   * Row model type for infinite scrolling
   */
  public rowModelType: 'infinite' = 'infinite';

  /**
   * Cache block size for pagination
   */
  public cacheBlockSize = 50;

  /**
   * Maximum blocks in cache
   */
  public maxBlocksInCache = 5;

  ngOnInit(): void {
    if (!this.dataSource) {
      console.error('TaskGrid: dataSource is required');
    }
  }

  /**
   * Called when the grid is ready
   * Sets up the infinite scroll datasource
   */
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    // Create datasource for infinite scroll
    const datasource: IDatasource = {
      getRows: (rowParams: IGetRowsParams) => {
        const offset = rowParams.startRow;
        const limit = rowParams.endRow - rowParams.startRow;

        this.dataSource(offset, limit)
          .then((response) => {
            if (response && response.rows && Array.isArray(response.rows)) {
              // Pass data to grid
              rowParams.successCallback(response.rows, response.lastRow);
              
              // Force grid to redraw after data is loaded
              setTimeout(() => {
                if (this.gridApi) {
                  this.gridApi.redrawRows();
                }
              }, 100);
            } else {
              console.error('Invalid response structure:', response);
              rowParams.failCallback();
            }
          })
          .catch((error) => {
            console.error('Error fetching tasks:', error);
            rowParams.failCallback();
          });
      },
    };

    // Set datasource with a small delay to ensure grid is ready
    setTimeout(() => {
      params.api.setGridOption('datasource', datasource);
    }, 0);
  }

  /**
   * Handles View button click
   */
  private onViewClick(task: Task): void {
    this.viewTask.emit(task);
  }

  /**
   * Formats date strings for display
   */
  private formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Refreshes the grid data
   */
  public refresh(): void {
    if (this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    }
  }

  /**
   * Updates the filter and refreshes the grid
   */
  public updateFilter(filterCode: string): void {
    this.filterCode = filterCode;
    this.refresh();
  }
}
