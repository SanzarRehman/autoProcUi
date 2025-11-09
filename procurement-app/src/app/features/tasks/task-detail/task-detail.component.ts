import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TaskService } from '../../../core/services/task.service';
import { TaskActionsResponse, TaskHistory, TaskAction, WorkflowPerformRequest } from '../../../core/models/task.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

/**
 * Component for displaying task details with actions and history
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoadingSpinnerComponent],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  module: string = '';
  key: string = '';
  ref: string = '';

  taskActions: TaskActionsResponse | null = null;
  taskHistory: TaskHistory[] = [];
  processDiagramUrl: string | null = null;
  loadingDiagram = false;
  procurementOrder: any = null;
  loadingOrder = false;
  showRRFModal = false;
  rrfContent: SafeHtml | null = null;
  loadingRRF = false;
  
  loading = false;
  error: string | null = null;
  performingAction = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private sanitizer: DomSanitizer,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Extract route parameters
    this.route.params.subscribe(params => {
      this.module = params['module'];
      this.key = params['key'];
      this.ref = params['ref'];
      
      // Fetch task actions and history
      this.loadTaskDetails();
      
      // Load procurement order details if ref is a PO number
      if (this.ref && this.ref.startsWith('PO-')) {
        this.loadProcurementOrder();
      }
    });
  }

  /**
   * Loads task actions and history from the API
   */
  private loadTaskDetails(): void {
    this.loading = true;
    this.error = null;

    // Fetch task actions
    this.taskService.getTaskActions(this.module, this.key, this.ref).subscribe({
      next: (actions) => {
        this.taskActions = actions;
      },
      error: (error) => {
        this.error = error.message || 'Failed to load task actions';
        this.errorHandler.handleError(error, 'Failed to load task actions');
        this.loading = false;
      }
    });

    // Fetch task history
    this.taskService.getTaskHistory(this.module, this.key, this.ref).subscribe({
      next: (history) => {
        this.taskHistory = history;
        this.loading = false;
        
        // Load process diagram from the first history entry
        if (history.length > 0 && history[0].processId) {
          this.loadProcessDiagram(history[0].processId);
        }
      },
      error: (error) => {
        this.error = error.message || 'Failed to load task history';
        this.errorHandler.handleError(error, 'Failed to load task history');
        this.loading = false;
      }
    });
  }

  /**
   * Loads the process diagram as a blob and creates an object URL
   */
  private loadProcessDiagram(processId: string): void {
    this.loadingDiagram = true;
    
    this.taskService.getProcessDiagram(processId).subscribe({
      next: (blob) => {
        // Create object URL from blob
        this.processDiagramUrl = URL.createObjectURL(blob);
        this.loadingDiagram = false;
      },
      error: (error) => {
        console.error('Failed to load process diagram:', error);
        this.loadingDiagram = false;
      }
    });
  }

  /**
   * Loads procurement order details
   */
  private loadProcurementOrder(): void {
    this.loadingOrder = true;
    
    this.taskService.getProcurementOrder(this.ref).subscribe({
      next: (order) => {
        this.procurementOrder = order;
        this.loadingOrder = false;
      },
      error: (error) => {
        console.error('Failed to load procurement order:', error);
        this.loadingOrder = false;
      }
    });
  }

  /**
   * Opens RRF in a modal popup
   */
  viewRRF(): void {
    if (this.ref) {
      this.loadingRRF = true;
      this.showRRFModal = true;
      
      // Fetch the HTML content and display in modal
      this.taskService.getRRFContent(this.ref).subscribe({
        next: (content) => {
          // Remove markdown code block markers if present
          let cleanedContent = content;
          if (content.startsWith('```html')) {
            cleanedContent = content.replace(/^```html\s*/, '').replace(/\s*```$/, '');
          }
          
          // Sanitize and set the HTML content
          this.rrfContent = this.sanitizer.bypassSecurityTrustHtml(cleanedContent);
          this.loadingRRF = false;
        },
        error: (error) => {
          console.error('Failed to load RRF content:', error);
          this.errorHandler.handleError(error, 'Failed to load RRF content');
          this.loadingRRF = false;
          this.showRRFModal = false;
        }
      });
    }
  }

  /**
   * Closes the RRF modal
   */
  closeRRFModal(): void {
    this.showRRFModal = false;
    this.rrfContent = null;
  }

  /**
   * Downloads RRF as PDF
   */
  downloadRRF(): void {
    if (this.ref) {
      window.open(`/pro/api/rrf/${this.ref}/pdf`, '_blank');
    }
  }

  /**
   * Clean up object URL when component is destroyed
   */
  ngOnDestroy(): void {
    if (this.processDiagramUrl) {
      URL.revokeObjectURL(this.processDiagramUrl);
    }
  }

  /**
   * Refreshes task details
   */
  refreshTaskDetails(): void {
    this.loadTaskDetails();
  }

  /**
   * Checks if the task is editable
   */
  isEditable(): boolean {
    return this.taskActions?.isEditable?.includes('true') || false;
  }

  /**
   * Handles claim task action
   */
  onClaimTask(): void {
    if (this.performingAction) {
      return;
    }

    this.performingAction = true;
    this.error = null;

    this.taskService.claimTask(this.module, this.key, this.ref).subscribe({
      next: () => {
        this.performingAction = false;
        this.errorHandler.showSuccess('Task claimed successfully');
        
        // Refresh task details after successful claim
        setTimeout(() => {
          this.refreshTaskDetails();
        }, 2000);
      },
      error: (error) => {
        this.performingAction = false;
        this.error = error.message || 'Failed to claim task';
        this.errorHandler.handleError(error, 'Failed to claim task');
      }
    });
  }

  /**
   * Handles release task action
   */
  onReleaseTask(): void {
    if (this.performingAction) {
      return;
    }

    this.performingAction = true;
    this.error = null;

    this.taskService.releaseTask(this.module, this.key, this.ref).subscribe({
      next: () => {
        this.performingAction = false;
        this.errorHandler.showSuccess('Task released successfully');
        
        // Refresh task details after successful release
        setTimeout(() => {
          this.refreshTaskDetails();
        }, 2000);
      },
      error: (error) => {
        this.performingAction = false;
        this.error = error.message || 'Failed to release task';
        this.errorHandler.handleError(error, 'Failed to release task');
      }
    });
  }

  /**
   * Handles edit task action
   */
  onEditTask(): void {
    // Edit functionality - could navigate to edit page or open modal
    console.log('Edit task clicked - implement navigation or modal');
  }

  /**
   * Handles dynamic action button clicks
   */
  onActionClick(action: TaskAction): void {
    this.performAction(action.name, action.label);
  }

  /**
   * Performs a workflow action
   */
  private performAction(actionName: string, actionLabel: string): void {
    if (this.performingAction) {
      return;
    }

    this.performingAction = true;
    this.error = null;

    const request: WorkflowPerformRequest = {
      action: actionName,
      key: this.key,
      ref: this.ref
    };

    this.taskService.performWorkflowAction(this.module, request).subscribe({
      next: () => {
        this.performingAction = false;
        this.errorHandler.showSuccess(`Action "${actionLabel}" performed successfully`);
        
        // Refresh task details after successful action
        setTimeout(() => {
          this.refreshTaskDetails();
        }, 2000);
      },
      error: (error) => {
        this.performingAction = false;
        this.error = error.message || `Failed to perform action "${actionLabel}"`;
        this.errorHandler.handleError(error, `Failed to perform action "${actionLabel}"`);
      }
    });
  }

  /**
   * Formats date string for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
}
