import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    BreadcrumbComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  title = 'Procurement System';
  username: string = '';
  userEmail: string = '';
  isMobile: boolean = false;
  isTablet: boolean = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened: boolean = true;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // Get user info from token (no API call)
    const profile = this.authService.getUserProfile();
    if (profile) {
      this.username = profile.username || profile.firstName || 'User';
      this.userEmail = profile.email || '';
    }

    // Configure responsive breakpoints
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .subscribe(result => {
        // Mobile: < 600px
        this.isMobile = this.breakpointObserver.isMatched(Breakpoints.XSmall);
        
        // Tablet: 600px - 1024px
        this.isTablet = this.breakpointObserver.isMatched(Breakpoints.Small) || 
                        this.breakpointObserver.isMatched(Breakpoints.Medium);

        // Configure sidenav behavior - always use drawer mode
        this.sidenavMode = 'over';
        this.sidenavOpened = false;
      });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenavOnMobile() {
    // Always close sidenav after navigation in drawer mode
    this.sidenav.close();
  }

  async logout() {
    await this.authService.logout();
  }
}
