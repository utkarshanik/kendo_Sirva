import {Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
// import { App2Component } from './app2/app2.component';
export const routes: Routes = [
  // { path: '', redirectTo: 'app22', pathMatch: 'full' },
  { path: '', redirectTo: 'navbar', pathMatch: 'full' },
  {path:'home', component:HomeComponent},
  {path:'navbar',component:NavbarComponent},
  // {path:'app22',component:App2Component},
];
