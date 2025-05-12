import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
interface UserCredentials {
  username: string;
  password: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserCredentials | null>(null);
  user$ = this.userSubject.asObservable();
 
  constructor() {}
 
  getToken(): string {
    return localStorage.getItem('token') || '';
  }
 
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
 
  login(username: string, password: string): void {
    const credentials: UserCredentials = { username, password };
    this.userSubject.next(credentials); // Store the credentials
  }
 
  logout(): void {
    this.userSubject.next(null); // Clear credentials
  }
 
  isLoggedIn(): boolean {
    return this.userSubject.value !== null; // Check if user is logged in
  }
}