import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ListMedicinesComponent } from './features/medicines/list-medicines/list-medicines';
import {AddMedicineComponent } from './features/medicines/add-medicine/add-medicine';
import { ListSalesComponent } from './features/sales/list-sales/list-sales';
import { EditMedicineComponent } from './features/medicines/edit-medicine/edit-medicine';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' } 
  },
  { 
    path: 'medicines', 
    component: ListMedicinesComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' } 
  },
  { 
    path: 'add-medicine', 
    component: AddMedicineComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' } 
  },
  { 
    path: 'sales', 
    component: ListSalesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'medicines/edit/:id', 
    component: EditMedicineComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' } 
  },
  { path: '**', redirectTo: '' }
];
