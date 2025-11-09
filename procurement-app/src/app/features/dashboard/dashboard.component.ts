import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TaskStatsService, TaskStats } from '../../core/services/task-stats.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats$: Observable<TaskStats>;

  constructor(private taskStatsService: TaskStatsService) {
    this.stats$ = this.taskStatsService.stats$;
  }

  ngOnInit(): void {
    // Load all task counts when dashboard opens
    this.taskStatsService.loadAllCounts();
  }
}
