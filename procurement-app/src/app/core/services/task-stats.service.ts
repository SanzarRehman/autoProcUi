import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { TaskService } from './task.service';
import { TaskResponse } from '../models/task.model';

export interface TaskStats {
  readyCount: number;
  inProgressCount: number;
  ownCount: number;
  loading: boolean;
}

export interface CachedTaskData {
  ready: TaskResponse | null;
  inProgress: TaskResponse | null;
  own: TaskResponse | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStatsService {
  private statsSubject = new BehaviorSubject<TaskStats>({
    readyCount: 0,
    inProgressCount: 0,
    ownCount: 0,
    loading: false
  });

  public stats$ = this.statsSubject.asObservable();

  // Cache for task data
  private cachedData: CachedTaskData = {
    ready: null,
    inProgress: null,
    own: null
  };

  constructor(private taskService: TaskService) {}

  /**
   * Load all task counts from API (called from dashboard)
   */
  loadAllCounts(): void {
    this.statsSubject.next({
      ...this.statsSubject.value,
      loading: true
    });

    // Default filter for ProcurementAutomation tasks
    const procurementFilter = {
      code: {
        filterType: 'text',
        type: 'contains',
        filter: 'ProcurementAutomation'
      }
    };

    // Fetch first page of each task type to get counts and cache data
    forkJoin({
      ready: this.taskService.getReadyTasks({ offset: 0, limit: 50, filter: procurementFilter }),
      inProgress: this.taskService.getInProgressTasks({ offset: 0, limit: 50, filter: procurementFilter }),
      own: this.taskService.getOwnTasks({ offset: 0, limit: 50, filter: procurementFilter })
    }).subscribe({
      next: (results) => {
        // Cache the data
        this.cachedData.ready = results.ready;
        this.cachedData.inProgress = results.inProgress;
        this.cachedData.own = results.own;

        // Update counts
        this.statsSubject.next({
          readyCount: results.ready.lastRow,
          inProgressCount: results.inProgress.lastRow,
          ownCount: results.own.lastRow,
          loading: false
        });
      },
      error: (error) => {
        console.error('Error loading task stats:', error);
        this.statsSubject.next({
          ...this.statsSubject.value,
          loading: false
        });
      }
    });
  }

  /**
   * Get cached ready tasks data
   */
  getCachedReadyTasks(): TaskResponse | null {
    return this.cachedData.ready;
  }

  /**
   * Get cached in-progress tasks data
   */
  getCachedInProgressTasks(): TaskResponse | null {
    return this.cachedData.inProgress;
  }

  /**
   * Get cached own tasks data
   */
  getCachedOwnTasks(): TaskResponse | null {
    return this.cachedData.own;
  }

  /**
   * Update ready tasks cache (called when refreshing)
   */
  updateReadyCache(data: TaskResponse): void {
    this.cachedData.ready = data;
    this.statsSubject.next({
      ...this.statsSubject.value,
      readyCount: data.lastRow
    });
  }

  /**
   * Update in-progress tasks cache (called when refreshing)
   */
  updateInProgressCache(data: TaskResponse): void {
    this.cachedData.inProgress = data;
    this.statsSubject.next({
      ...this.statsSubject.value,
      inProgressCount: data.lastRow
    });
  }

  /**
   * Update own tasks cache (called when refreshing)
   */
  updateOwnCache(data: TaskResponse): void {
    this.cachedData.own = data;
    this.statsSubject.next({
      ...this.statsSubject.value,
      ownCount: data.lastRow
    });
  }

  /**
   * Get current stats value
   */
  getCurrentStats(): TaskStats {
    return this.statsSubject.value;
  }
}
