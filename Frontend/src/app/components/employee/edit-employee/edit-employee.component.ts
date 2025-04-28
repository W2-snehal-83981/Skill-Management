import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-employee',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {

  employeeForm!: FormGroup;
  empId!: string;
  isLoading = true;
  skillOptions:any= [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

     // Initialize form with null values
     this.employeeForm = this.fb.group({
      department_name: [null, Validators.required],
      skill_category: [null, Validators.required],
      skill: [null, Validators.required],
      skill_level: [null, Validators.required]
    });

    this.empId = this.route.snapshot.paramMap.get('id')!;
     console.log(this.empId);

    this.employeeService.getEmployeeById(this.empId).subscribe({
      next: (data) => {
        const employeeData = data[0]; //data is coming as an array in console,so taking as object
        console.log(employeeData);

        // Patch the form with the fetched employee data
        this.employeeForm.patchValue({
          department_name: employeeData.department_name,
          skill_category: employeeData.skill_category,
          skill: employeeData.skill,
          skill_level: employeeData.skill_level
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load employee data', err);
        this.router.navigate(['/employee-dashboard',this.empId]);
      }
    });
    this.fetchSkills();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid){
      console.error('Form is invalid');
      return
    };

    console.log('Form value:', this.employeeForm.value);
    // const updatedEmployee = this.employeeForm.value;
    this.employeeService.updateEmployee(this.empId, this.employeeForm.value).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        console.log('Form data submitted:', this.employeeForm.value);
        this.router.navigate(['/employee-dashboard', this.empId]);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Update failed. Try again.');
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/employee-dashboard', this.empId]);
  }

fetchSkills() {
 this.employeeService.getAllSkills().subscribe({
  next: (skills) => {
    this.skillOptions = skills;
    console.log('Fetched skills:', skills);
  },
  error: (err) => {
    console.error('Failed to fetch skills', err);
  }
 });
}

  
}
