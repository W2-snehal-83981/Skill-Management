import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee-service.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Employee Training Management';
  loginForm!: FormGroup;                         //using the '!' we assured the form is not empty.
  isLoading = false;                              
  errorMessage = '';
  //hidePassword: any;
  
  constructor(
    private formBuilder: FormBuilder,             
    private employeeService: EmployeeService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],             //validations of feilds.
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;
    console.log(this.employeeService.login(email, password)); 

    
    this.employeeService.login(email, password)?.subscribe({
      next: (response) => {
        const { password, ...userWithoutPassword } = response.userData;

      console.log('Login successful', response);
      //localStorage.setItem('user', JSON.stringify(response.userData)); //after login user store in localstorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('role', response.role);  //after login role store in localstorage
      localStorage.setItem('token',response.token);  //after login token store in localstorage
      
      if(response.role === 'Admin'){
        this.router.navigate(['/admin-dashboard']);
      }
      else{
        // this.router.navigateByUrl('/employee-dashboard');
        this.router.navigate(['/employee-dashboard',userWithoutPassword.emp_id]); //passing id in route param, taking from response of backend
      }
      },
      error: (error) => {
      console.error('Login failed', error);
      this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      this.isLoading = false;
      },
      complete: () => {
      this.isLoading = false;
      }
    });
  }
}
