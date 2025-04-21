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
  userForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';
  roles = ['user'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10,15}$")]],
      country: ['', Validators.required],
      role: ['',Validators.required]
    });
  }

  get formControls() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      
      Object.keys(this.formControls).forEach(field => {
        const control = this.userForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.employeeService.addEmployee(this.userForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.userForm.reset();
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'An error occurred while adding the user. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.userForm.reset();
    this.userForm.patchValue({         //the patchValue is the inbuild method which always reset the value of role feild to user.
      role: 'User'
    });
    this.errorMessage = '';
  }

  loginform(){
    this.router.navigate(['/login']);
      

  }
}
