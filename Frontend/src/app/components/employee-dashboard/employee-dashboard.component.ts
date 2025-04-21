import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit{
  employeeForm: FormGroup; // Define the reactive form group
  employee: any = {}; // Store employee data
  isLoading: boolean = true;

  constructor(private employeeService: EmployeeService, private router: Router) {
    // Initialize the form with empty values
    this.employeeForm = new FormGroup({
      emp_id: new FormControl(''),
      name: new FormControl(''),
      department_name: new FormControl(''),
      skill: new FormControl(''),
      skill_level: new FormControl(''),
      date_of_joining: new FormControl(''),
      training_link: new FormControl(''),
      status: new FormControl(''),
      // profile_photo: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.employee = this.employeeService.getEmployee();
    //console.log(this.employee);
    if(!this.employee.emp_id){
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    // Handle logout functionality (clear local storage or token)
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
