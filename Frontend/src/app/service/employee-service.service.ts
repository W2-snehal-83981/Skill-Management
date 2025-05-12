import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  //get all users
  getAllEmployee():Observable<any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    // return this.http.get(`${this.URL}/employees/`,{headers});
    return this.http.get(`${this.URL}/employees/`);
  }

  getEmployeeById(id:string): Observable<any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    //return this.http.get(`${this.URL}/employees/${id}`,{headers});
    return this.http.get(`${this.URL}/employees/${id}`);
  }

  login(email:string,password:string): Observable<any> {
    return this.http.post(`${this.URL}/auth/login`,{email,password});
  }

  addEmployee(employee:any): Observable<any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post(`${this.URL}/auth/register`,employee);
  }

  getEmployee(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

   //reset Password
  resetPassword(data: {email:string, newPassword: string, confirmPassword:string}): Observable<any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.post(`${this.URL}/auth/reset-password`,data);
  }

  deleteEmployee(id:number) : Observable<any> {
    return this.http.delete(`${this.URL}/employees/delemp/${id}`);
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    // return this.http.put(`${this.URL}/employees/editemp/${id}`, employeeData,{headers});
    return this.http.put(`${this.URL}/employees/editemp/${id}`, employeeData);
  }

  updateStatus(id: string, status: any): Observable<any> {
    //console.log('Payload for updateEmployee:', { id, status });
    return this.http.put(`${this.URL}/employees/status/${id}`, {status});
  }

  getEmployeeByRole(role:string) : Observable<any> {
    return this.http.get(`${this.URL}/employees/filter?role=${role}`);
  }

  getAllSkills(): Observable <any> {
    return this.http.get(`${this.URL}/employees/skills`);
  }

  completedTrainings(): Observable <any> {
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`
    // });
    return this.http.get(`${this.URL}/employees/audit`);
  }
}
