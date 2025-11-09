/**
 * Core data models and interfaces for the procurement task management system
 */

/**
 * Represents a task in the procurement system
 */
export interface Task {
  id: string;
  module: string;
  code: string;
  ref: string;
  assignee: string;
  stepName: string;
  startedAt: string;
  name: string;
  initiator: string;
  claimTime: string;
  title: string;
  reference: string | null;
  startUserInitiator: string | null;
  viewUrl: string | null;
  meta: any | null;
  endTime: string | null;
}

/**
 * API response structure for task list endpoints
 */
export interface TaskResponse {
  rows: Task[];
  lastRow: number;
}

/**
 * Query parameters for task pagination
 */
export interface TaskQueryParams {
  offset: number;
  limit: number;
  filter?: TaskFilter;
}

/**
 * Filter configuration for task queries
 */
export interface TaskFilter {
  [key: string]: {
    filterType: string;
    type: string;
    filter: string;
  };
}

/**
 * Represents an action that can be performed on a task
 */
export interface TaskAction {
  name: string;
  label: string;
  css: string;
  place: string;
}

/**
 * API response structure for task actions endpoint
 */
export interface TaskActionsResponse {
  name: string;
  label: string;
  actions: TaskAction[];
  assignee: string;
  isEditable: string[];
  claimable: boolean;
  releasable: boolean;
}

/**
 * Represents a history entry for a task
 */
export interface TaskHistory {
  processId: string;
  stepName: string;
  startAt: string;
  endAt: string | null;
  remarks: string | null;
  assignee: string;
  updateBy: string | null;
  actionName: string | null;
  actionLabel: string | null;
}

/**
 * Request payload for performing workflow actions
 */
export interface WorkflowPerformRequest {
  action: string;
  key: string;
  ref: string;
}
