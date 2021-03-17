import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterPage } from './pages/register/register.page';
import { LoginPage } from './pages/login/login.page';
import { LoginGuard } from './guards/login.guard';
const routes: Routes = [
  
  {
    path: '', pathMatch: 'full', redirectTo: 'tabs'
  },
   {
     
    path: 'login', 
   component:LoginPage

  },
  {
    path: 'register', 
    component:RegisterPage
  },
  {
    path: 'tabs',
    loadChildren: () => import('../app/pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[LoginGuard]

  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
