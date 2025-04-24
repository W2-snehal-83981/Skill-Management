import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodayDatePipe } from '../../pipes/today-date.pipe';

@Component({
  selector: 'app-employee-dashboard',
  imports: [ReactiveFormsModule,CommonModule,TodayDatePipe],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit{
  employee: any = {}; // Store employee data
  isLoading: boolean = true;
  statusForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService, 
    private router: Router, 
    private route: ActivatedRoute,  // To get the employee ID from the URL
    private fb: FormBuilder
  ) {
    // this.statusForm = new FormGroup({  // Initialize the form with the default value for status
    //   status: new FormControl('')  // Initialize with the employee's current status
    // })
  }

  ngOnInit(): void {

     const empId = this.route.snapshot.paramMap.get('emp_id');
     if (empId) {
      this.employeeService.getEmployeeById(empId).subscribe(
        (data) => {
          this.employee = data[0]; //employee data on console gives in array so retrive as array here
          this.isLoading = false; // Set loading to false once data is loaded

          // this.statusForm.get('status')?.setValue(this.employee.status);  // Set the status form control to the employee's status
          this.statusForm = this.fb.group({
            status: [this.employee.Status || ''] // Set the initial value to the current status or default to empty string
          });
        },
        (error) => {
          console.error('Error fetching employee data', error);
          this.router.navigate(['/login']); // Navigate to login if error
        }
      );
    } else {
      console.error('No employee ID found');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    // Handle logout functionality (clear local storage or token)
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goToEdit(empId: string) {
    this.router.navigate(['/edit-employee',empId]);
  }

  updateStatus() {
    const newStatus = this.statusForm.get('status')?.value;   //status from the form control
  
    this.employeeService.updateStatus(this.employee.EmployeeID, newStatus).subscribe(
      (response) => {
        this.employee.Status = newStatus;
        console.log('Status updated successfully: ',response);
      },
      (error) => {
        console.log('Error updating status: ',error);
      }
    );
  }
}
