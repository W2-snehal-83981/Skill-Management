import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleGuardService } from './service/role-guard.service';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { ViewEmployeeComponent } from './components/employee/view-employee/view-employee.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { RegisterComponent } from './components/employee/register/register.component';

export const routes: Routes = [
    {path:'login', component :LoginComponent},
    {path:'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuardService], data: {expectedRole:'Admin'}},
    {path:'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [RoleGuardService], data: {expectedRole:'Employee'}},
    {path:'view-emp', component:ViewEmployeeComponent},
    {path:'reset-password', component:ResetPasswordComponent},
    {path:'register',component:RegisterComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full',}
];
