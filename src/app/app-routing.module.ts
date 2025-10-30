import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffContractComponent } from './components/staff-contract/staff-contract.component';

const routes: Routes = [
  { path: '', redirectTo: 'staff-contract', pathMatch: 'full' },
  { path: 'staff-contract', component: StaffContractComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
