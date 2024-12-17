import { Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
 

export const routes: Routes = [
    {path:'user/home',component:HomeComponent},
    {path:'user',redirectTo:'user/home',pathMatch:'full'},
    {path:'',redirectTo:'user/home',pathMatch:'full'},
];
