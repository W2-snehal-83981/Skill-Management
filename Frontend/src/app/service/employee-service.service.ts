import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

    //get all users
  getAllEmployee():Observable<any> {
    return this.http.get(`${this.URL}/employees/`);
  }

  getEmployeeById(id:string): Observable<any> {
    return this.http.get(`${this.URL}/employees/${id}`);
  }

  login(email:string,password:string): Observable<any> {
    return this.http.post(`${this.URL}/auth/login`,{email,password});
  }

  addEmployee(employee:any): Observable<any> {
    return this.http.post(`${this.URL}/auth/register`,employee);
  }

  getEmployee(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

   //reset Password
  resetPassword(data: {email:string, newPassword: string, confirmPassword:string}): Observable<any> {
    return this.http.post(`${this.URL}/auth/reset-password`,data);
  }

  deleteEmployee(id:number) : Observable<any> {
    return this.http.delete(`${this.URL}/employees/delemp/${id}`);
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    console.log('updateEmployee:', { employeeData });
    return this.http.put(`${this.URL}/employees/editemp/${id}`, employeeData);
  }

  updateStatus(id: string, status: any): Observable<any> {
    console.log('Payload for updateEmployee:', { id, status });
    return this.http.put(`${this.URL}/employees/status/${id}`, {status});
  }
}
