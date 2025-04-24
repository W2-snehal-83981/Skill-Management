import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../service/employee-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule,ReactiveFormsModule],
  providers:[DatePipe],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId! : string;   // Employee ID from the route parameter
  employeeData: any;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    this.employeeService.getEmployeeById(this.employeeId).subscribe(
      (data)=> {
        this.employeeData = data[0];
      },
      (error) => {
        console.log('Failed to fetch employee data', error)
      }
    )
  }

}
