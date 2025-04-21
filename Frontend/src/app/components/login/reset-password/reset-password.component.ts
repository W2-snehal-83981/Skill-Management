import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../service/employee-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute  //for dynamically passing attributes
  ){
    this.resetForm = fb.group ({
      newPassword: ['',[Validators.required,Validators.minLength(4)]],
      confirmPassword: ['',[Validators.required,Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {   //taking email from login page as query params
      this.email = params['email']
      this.email = params['email']
    });
  }

  onSubmit() {
    if(this.resetForm.valid) {
      const {newPassword, confirmPassword} = this.resetForm.value;

      if(newPassword != confirmPassword) {
        alert('Password do not match!');
        return;
      }

      this.employeeService.resetPassword({email: this.email, newPassword, confirmPassword})
        .subscribe(
          (res) => {
            alert('Password reser successfully. Please login again');
            this.router.navigate(['/login']);
          },
          (err) => alert('Error resetting password!')
        );
    }
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}
