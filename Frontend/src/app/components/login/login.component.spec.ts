import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { EmployeeService } from '../../service/employee-service.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Component } from '@angular/core';
@Component({ template: '' })
class DummyComponent {}

class MockEmployeeService{
  login(email:string, password:string) {
    return of({
      userData:{date_of_joining: "2025-01-12T18:30:00.000Z",
        department_name: "IT-Application",
        email: "sharvary@gmail.com",
        emp_id: "EMP02",
        isdeleted: false,
        name: "Sharvary",
        password:"$2b$05$1zb7lji49EOxh5mQIS20HeydCX2ARzcDWFbwBl1VVu24OMB1cNITC",
        role:"Admin",
        skill:"React",
        skill_category:"Frontend",
        skill_level:"Beginner",
        status: "Completed"
      },
      role:'Admin',
      token:'sample-token'
    });
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let employeeService: EmployeeService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [LoginComponent],
      imports: [ReactiveFormsModule,FormsModule,RouterTestingModule.withRoutes([ { path: 'admin-dashboard/:id', component: DummyComponent },
        { path: 'employee-dashboard/:id', component: DummyComponent }]),LoginComponent],
      providers: [
        {provide: EmployeeService, useClass: MockEmployeeService},
        {provide:Router, useClass: MockRouter}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(()=> {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should initialize the login form with empty fields', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email'].value).toBe('');
    expect(component.loginForm.controls['password'].value).toBe('');
  });

  it('should be invalid when form is empty', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should not call employeeService.login when the form is invalid', () => {
    spyOn(employeeService, 'login');
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onSubmit();
    expect(employeeService.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate to the admin dashboard on successful login' , ()=>{
    spyOn(router, 'navigate');
    component.loginForm.controls['email'].setValue('sharvary@gmail.com');
    component.loginForm.controls['password'].setValue('$2b$05$1zb7lji49EOxh5mQIS20HeydCX2ARzcDWFbwBl1VVu24OMB1cNITC');
    component.onSubmit();
    expect(employeeService.login).toHaveBeenCalled();
    expect(localStorage.getItem('user')).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(['admin-dashboard','EMP01']);
  });

  it('should display error message when login fails', () => {
    spyOn(employeeService, 'login').and.returnValue(throwError({ error: { message: 'Invalid credentials' }}));
    component.loginForm.controls['email'].setValue('wrong@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid credentials');
    expect(component.isLoading).toBeFalse();
  });

});
