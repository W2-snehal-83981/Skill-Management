import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../service/employee-service.service';

@Component({
  selector: 'app-view-employee',
  imports: [CommonModule, RouterModule],
  providers:[DatePipe],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  users: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  deleteInProgress: boolean = false;
  deletingUserId: number | null = null;
  private subscription: Subscription = new Subscription();
  

  constructor(private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.subscription.add(
      this.employeeService.getAllEmployee().subscribe({
        next: (data: any) => {
          this.users = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load users. Please try again later.';
          this.isLoading = false;
          console.error('Error fetching users:', error);
        }
      })
    );
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deletingUserId = id;
      this.deleteInProgress = true;
      
      this.subscription.add(
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.loadUsers(); // Reload users after deletion
            this.deleteInProgress = false;
            this.deletingUserId = null;
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete user. Please try again.';
            this.deleteInProgress = false;
            this.deletingUserId = null;
            console.error('Error deleting user:', error);
          }
        })
      );
    }
  }

  editUser(id: number): void {
    this.router.navigate(['edit-user', id], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
