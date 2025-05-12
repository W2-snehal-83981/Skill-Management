import { Component } from '@angular/core';
import { EmployeeService } from '../../service/employee-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent {
 auditRecords: any[] = [];
 filterForm: FormGroup;

 constructor(private employeeService : EmployeeService,private fb: FormBuilder){
  this.filterForm = this.fb.group({
    emp_id: [''],
    skill:[''],
    skill_level:['']
  });
 }

 ngOnInit():void {
  this.loadAuditRecords();
 }

 loadAuditRecords(){
  this.employeeService.completedTrainings().subscribe(
    (data) => {
      this.auditRecords = data;
    },
    (error) => {
      console.error('Error fetching audit records:', error);
    }
  )
 }

//  applyFilters(): void {
//   const formValues = this.filterForm.value;

//   this.isLoading = true;  // Show loading spinner

//   // Fetch filtered records based on the form values
//   this.employeeService.getAuditRecords(formValues).subscribe(
//     (data) => {
//       this.auditRecords = data;
//       this.isLoading = false;
//     },
//     (error) => {
//       console.error('Error applying filters:', error);
//       this.isLoading = false;
//     }
//   );
// }

}
