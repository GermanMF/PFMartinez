import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { LoginGuard } from './core/auth/guards/login.guard';
import { AuthComponent } from './core/auth/auth.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'auth',
    canActivate: [LoginGuard],
    component: AuthComponent,
    loadChildren: () => import('./core/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    // CUALQUIER RUTA
    path: '**',
    redirectTo: 'dashboard',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
