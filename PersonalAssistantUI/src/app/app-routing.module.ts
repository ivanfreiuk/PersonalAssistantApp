import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllAssignmentsPageComponent, AssignmentComponent, AssignmentListComponent, HomeComponent, LoginComponent, RegisterComponent, UserListComponent, UserProfileComponent, UserProfileSettingsComponent } from './components';
import { UserAssignmentsPageComponent } from './components/assignment/user-assignments-page/user-assignments-page.component';
import { CometChatUIComponent } from './components/CometChat-ui/cometchat-ui/cometchat-ui.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'chat',
    component: CometChatUIComponent
  },
  {
    path: 'new-assignment',
    component: AssignmentComponent
  },
  {
    path: 'all-assignments',
    component: AllAssignmentsPageComponent
  },
  {
    path: 'my-assignments',
    component: UserAssignmentsPageComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent
  },
  {
    path: 'settings',
    component: UserProfileSettingsComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
