import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodayDatePipe } from '../../pipes/today-date.pipe';
import { EmployeeService } from '../../service/employee-service.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule,CommonModule,TodayDatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
 employee: any = {}; // Store employee data

  constructor(private router: Router,
    private employeeService: EmployeeService,  
    private route: ActivatedRoute  // To get the employee ID from the URL) {}
  ){}
   
  ngOnInit(): void {
    const empId = this.route.snapshot.paramMap.get('emp_id');
    if (empId) {
     this.employeeService.getEmployeeById(empId).subscribe(
       (data) => {
         this.employee = data[0]; //employee data on console gives in array so retrive as array here
         console.log(this.employee); 
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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    return alert('Logout Successfully');
  }
}
