import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../service/employee-service.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  employeeForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      emp_id:['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      date_of_joining: ['', Validators.required],
      department_name: [null, Validators.required],
      skill_category: [null, Validators.required],
      skill: [null, Validators.required],
      skill_level: [null, Validators.required],
      role: [null, Validators.required]
    });
  }

  get formControls() {
    return this.employeeForm.controls;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      Object.keys(this.formControls).forEach(field => {
        const control = this.employeeForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.employeeService.addEmployee(this.employeeForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.employeeForm.reset();
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'An error occurred while registering the employee. Please try again.';
      }
    });
  }
  resetForm(): void {
    this.employeeForm.reset();
    this.employeeForm.patchValue({         //the patchValue is the inbuild method which always reset the value of role feild to user.
      role: 'Employee'
    });
    this.errorMessage = '';
  }

  loginform(){
    this.router.navigate(['/login']);
      

  }
}
