import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskGridComponent } from '../../../shared/components/task-grid/task-grid.component';
import { TaskService } from '../../../core/services/task.service';
import { TaskStatsService } from '../../../core/services/task-stats.service';
import { Task, TaskResponse } from '../../../core/models/task.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

/**
 * Component for displaying in-progress tasks
 * Shows tasks that are currently being worked on
 */
@Component({
  selector: 'app-in-progress-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TaskGridComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './in-progress-tasks.component.html',
  styleUrls: ['./in-progress-tasks.component.scss']
})
export class InProgressTasksComponent implements OnInit {
  @ViewChild(TaskGridComponent) taskGrid!: TaskGridComponent;

  loading = false;
  error: string | null = null;
  filterCode = 'ProcurementAutomation';

  constructor(
    private taskService: TaskService,
    private taskStatsService: TaskStatsService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Component initialization - grid will fetch data via datasource
  }

  /**
   * Data source function for TaskGrid component
   * Fetches in-progress tasks with pagination
   */
  fetchInProgressTasks = async (offset: number, limit: number): Promise<{ rows: Task[]; lastRow: number }> => {
    try {
      this.error = null;

      // Check if we have cached data for the first page (only when no filter is active)
      if (offset === 0 && limit <= 50 && !this.filterCode) {
        const cached = this.taskStatsService.getCachedInProgressTasks();
        if (cached && cached.rows.length > 0) {
          // Return cached data
          return {
            rows: cached.rows.slice(0, limit),
            lastRow: cached.lastRow
          };
        }
      }

      // Fetch from API
      const response: TaskResponse = await this.taskService
        .getInProgressTasks({ 
          offset, 
          limit,
          filter: this.filterCode ? {
            code: {
              filterType: 'text',
              type: 'contains',
              filter: this.filterCode
            }
          } : undefined
        })
        .toPromise() as TaskResponse;

      // Update cache if it's the first page and no filter is active
      if (offset === 0 && !this.filterCode) {
        this.taskStatsService.updateInProgressCache(response);
      }

      return {
        rows: response.rows,
        lastRow: response.lastRow
      };
    } catch (error: any) {
      this.error = error.message || 'Failed to load in-progress tasks';
      this.errorHandler.handleError(error, 'Failed to load in-progress tasks');
      throw error;
    }
  };

  /**
   * Handles view task action
   * Navigates to task detail view
   */
  onViewTask(task: Task): void {
    this.router.navigate(['/tasks/detail', task.module, task.code, task.ref]);
  }

  /**
   * Refreshes the task grid
   */
  refresh(): void {
    this.error = null;
    if (this.taskGrid) {
      this.taskGrid.refresh();
    }
  }

  /**
   * Applies the filter and refreshes the grid
   */
  applyFilter(): void {
    this.refresh();
  }

  /**
   * Clears the filter and refreshes the grid
   */
  clearFilter(): void {
    this.filterCode = '';
    this.refresh();
  }
}
