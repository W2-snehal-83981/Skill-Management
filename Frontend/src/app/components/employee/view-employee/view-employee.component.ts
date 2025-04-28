import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../service/employee-service.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-employee',
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {
  users: any[] = [];
  //filteredEmployees: any[] = [];
  selectedRole: string ='';
  roleForm: FormGroup;
  deletingUserId: number | null = null;

  private subscription: Subscription = new Subscription();
  

  constructor(private employeeService: EmployeeService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      role: new FormControl('')  // Initial value is empty, no role selected
    });
   }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
      this.employeeService.getEmployeeByRole(this.selectedRole).subscribe((data) => {
        this.users = data;
        console.log(data.role);
      });

      this.employeeService.getAllEmployee().subscribe((data) => {
          this.users = data;
      });
  }

  filterEmployees() :void {
   this.selectedRole = this.roleForm.get('role')?.value;
   console.log(this.selectedRole);
  //  this.loadUsers();
  if (this.selectedRole) {
    this.employeeService.getEmployeeByRole(this.selectedRole).subscribe((data) => {
      this.users = data;
      console.log('Filtered Users by Role:', data);
    });
  } else {
    // If no role is selected, fetch all employees
    this.employeeService.getAllEmployee().subscribe((data) => {
      this.users = data;
      console.log('All Users:', data);
    });
  }
    }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deletingUserId = id;
      
      this.subscription.add(
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.loadUsers(); // Reload users after deletion
            this.deletingUserId = null;
          },
          error: (error) => {
            this.deletingUserId = null;
            console.error('Error deleting user:', error);
          }
        })
      );
    }
  }

  viewEmployee(employeeID:string){
    this.router.navigate(['/employee-details',employeeID]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
