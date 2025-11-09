import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ReadyTasksComponent } from './features/tasks/ready-tasks/ready-tasks.component';
import { InProgressTasksComponent } from './features/tasks/in-progress-tasks/in-progress-tasks.component';
import { OwnTasksComponent } from './features/tasks/own-tasks/own-tasks.component';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail.component';
import { InventoryListComponent } from './features/inventory/inventory-list/inventory-list.component';
import { OrderListComponent } from './features/procurement/order-list/order-list.component';
import { GlListComponent } from './features/gl/gl-list/gl-list.component';
import { EmailListComponent } from './features/emails/email-list/email-list.component';
import { EmailThreadComponent } from './features/emails/email-thread/email-thread.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'ready',
        pathMatch: 'full'
      },
      {
        path: 'ready',
        component: ReadyTasksComponent
      },
      {
        path: 'in-progress',
        component: InProgressTasksComponent
      },
      {
        path: 'own',
        component: OwnTasksComponent
      },
      {
        path: 'detail/:module/:key/:ref',
        component: TaskDetailComponent
      }
    ]
  },
  {
    path: 'emails',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: EmailListComponent
      },
      {
        path: 'thread/:poNumber',
        component: EmailThreadComponent
      }
    ]
  },
  {
    path: 'inventory',
    component: InventoryListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'procurement',
    component: OrderListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'gl',
    component: GlListComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
