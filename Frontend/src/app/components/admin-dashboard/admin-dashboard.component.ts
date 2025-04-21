import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TodayDatePipe } from '../../pipes/today-date.pipe';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule,CommonModule,TodayDatePipe],
  // providers: [DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(private router: Router) {}
    
  logout() {
    this.router.navigate(['/login']);
    return alert('Logout Successfully');
  }
}
