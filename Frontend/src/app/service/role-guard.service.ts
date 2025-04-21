import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate{

  constructor(private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
      const role = localStorage.getItem('role');

      if(role === route.data['expectedRole']) {  //checking if role matches
        return true;
      }
      else{
        this.router.navigate(['/login']);  //if not matches redirect to login
        return false;
      }
  }
}
