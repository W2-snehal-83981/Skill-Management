import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleGuardService } from './service/role-guard.service';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { ViewEmployeeComponent } from './components/employee/view-employee/view-employee.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { RegisterComponent } from './components/employee/register/register.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { EmployeeDetailsComponent } from './components/employee/employee-details/employee-details.component';
import { AuditComponent } from './components/audit/audit.component';

export const routes: Routes = [
    {path:'login', component :LoginComponent},
    {path:'admin-dashboard/:emp_id', component: AdminDashboardComponent, canActivate: [RoleGuardService], data: {expectedRole:'Admin'}},
    {path:'employee-dashboard/:emp_id', component: EmployeeDashboardComponent, canActivate: [RoleGuardService], data: {expectedRole:'Employee'}},
    {path:'view-emp', component:ViewEmployeeComponent},
    {path:'employee-details/:id',component:EmployeeDetailsComponent},
    {path:'edit-employee/:id', component: EditEmployeeComponent},
    {path:'reset-password', component:ResetPasswordComponent},
    {path:'register',component:RegisterComponent},
    {path:'audit',component:AuditComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];
