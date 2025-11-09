import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Task,
  TaskResponse,
  TaskQueryParams,
  TaskFilter,
  TaskActionsResponse,
  TaskHistory,
  WorkflowPerformRequest
} from '../models/task.model';

/**
 * Service for managing task-related API communications
 * Handles fetching tasks, task actions, task history, and performing workflow actions
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches ready tasks from the API with pagination and optional filters
   * @param queryParams Pagination parameters (offset, limit, and optional filter)
   * @returns Observable of TaskResponse containing ready tasks
   */
  getReadyTasks(queryParams: TaskQueryParams): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('offset', queryParams.offset.toString())
      .set('limit', queryParams.limit.toString());

    params = this.addFilterParams(params, queryParams.filter);

    return this.http
      .get<TaskResponse>(`${this.apiUrl}/bpa/task/ready`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches in-progress tasks from the API with pagination and optional filters
   * @param queryParams Pagination parameters (offset, limit, and optional filter)
   * @returns Observable of TaskResponse containing in-progress tasks
   */
  getInProgressTasks(queryParams: TaskQueryParams): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('offset', queryParams.offset.toString())
      .set('limit', queryParams.limit.toString());

    params = this.addFilterParams(params, queryParams.filter);

    return this.http
      .get<TaskResponse>(`${this.apiUrl}/bpa/task/in-progress`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches own tasks (tasks assigned to current user) from the API with pagination and optional filters
   * @param queryParams Pagination parameters (offset, limit, and optional filter)
   * @returns Observable of TaskResponse containing own tasks
   */
  getOwnTasks(queryParams: TaskQueryParams): Observable<TaskResponse> {
    let params = new HttpParams()
      .set('offset', queryParams.offset.toString())
      .set('limit', queryParams.limit.toString());

    params = this.addFilterParams(params, queryParams.filter);

    return this.http
      .get<TaskResponse>(`${this.apiUrl}/bpa/task/own`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds filter parameters to HttpParams
   * @param params Existing HttpParams
   * @param filter Optional filter configuration
   * @returns Updated HttpParams with filter parameters
   */
  private addFilterParams(params: HttpParams, filter?: TaskFilter): HttpParams {
    if (!filter) {
      return params;
    }

    Object.keys(filter).forEach(key => {
      const filterConfig = filter[key];
      params = params
        .set(`filter[${key}][filterType]`, filterConfig.filterType)
        .set(`filter[${key}][type]`, filterConfig.type)
        .set(`filter[${key}][filter]`, filterConfig.filter);
    });

    return params;
  }

  /**
   * Fetches available actions for a specific task
   * @param module The module identifier
   * @param key The task key/code
   * @param ref The task reference
   * @returns Observable of TaskActionsResponse containing available actions
   */
  getTaskActions(module: string, key: string, ref: string): Observable<TaskActionsResponse> {
    const params = new HttpParams()
      .set('module', module)
      .set('key', key)
      .set('ref', ref);

    return this.http
      .get<TaskActionsResponse>(`${this.apiUrl}/bpa/actions`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches history for a specific task
   * @param module The module identifier
   * @param key The task key/code
   * @param ref The task reference
   * @returns Observable of TaskHistory array containing task history entries
   */
  getTaskHistory(module: string, key: string, ref: string): Observable<TaskHistory[]> {
    const params = new HttpParams()
      .set('module', module)
      .set('key', key)
      .set('ref', ref);

    return this.http
      .get<TaskHistory[]>(`${this.apiUrl}/bpa/history`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Claims a task
   * @param module The module identifier
   * @param key The task key/code
   * @param ref The task reference
   * @returns Observable of the API response
   */
  claimTask(module: string, key: string, ref: string): Observable<any> {
    const params = new HttpParams()
      .set('module', module)
      .set('key', key)
      .set('ref', ref);

    return this.http
      .put(`${this.apiUrl}/bpa/claim`, null, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Releases a task
   * @param module The module identifier
   * @param key The task key/code
   * @param ref The task reference
   * @returns Observable of the API response
   */
  releaseTask(module: string, key: string, ref: string): Observable<any> {
    const params = new HttpParams()
      .set('module', module)
      .set('key', key)
      .set('ref', ref);

    return this.http
      .put(`${this.apiUrl}/bpa/release`, null, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Performs a workflow action on a task
   * @param module The module identifier
   * @param request The workflow perform request containing action, key, and ref
   * @returns Observable of the API response
   */
  performWorkflowAction(module: string, request: WorkflowPerformRequest): Observable<any> {
    return this.http
      .post(`/pro/${module}/v1/workflow/perform`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets the process diagram as a blob with authentication
   * @param processId The process instance ID
   * @returns Observable of the diagram blob
   */
  getProcessDiagram(processId: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/bpa/process-api/runtime/process-instances/${processId}/diagram`, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets procurement order details by PO number
   * @param poNumber The PO number
   * @returns Observable of the procurement order
   */
  getProcurementOrder(poNumber: string): Observable<any> {
    return this.http
      .get(`/pro/api/procurement/${poNumber}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Gets RRF HTML content
   * @param poNumber The PO number
   * @returns Observable of the HTML content as text
   */
  getRRFContent(poNumber: string): Observable<string> {
    return this.http
      .get(`/pro/api/rrf/${poNumber}/content`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  /**
   * Centralized error handler for all service methods
   * @param error The error object from HTTP request
   * @returns Observable that throws a formatted error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        errorMessage = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = `Error: ${error.status} - ${error.message || error.statusText}`;
      }
    }

    console.error('TaskService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
