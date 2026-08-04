import { Component, inject, OnInit, signal } from '@angular/core';
import { Dashboard } from '../../../core/services/dashboard/dashboard';
import { DashboardData } from '../../../core/models/dashboard.model';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../shared/components/loading/loading';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    EmptyState,
    Loading,
    StatCard,
    CurrencyPipe,
    DatePipe,
    StatusBadge,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{

  // inject services
  dashboardService = inject(Dashboard);

  // state data
  dashboardData = signal<DashboardData | null>(null)

  // state loading dan error
  loading = signal(false);
  errorMessage = signal('');

  loadDashboard(): void {
    this.loading.set(true);

    this.dashboardService
    .getDashboard()
    .subscribe({
      next: (response) => {
        this.dashboardData.set(response.data);
        console.log(this.dashboardData());
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Gagal memuat Dashboard. Silakan coba lagi.');
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

}
