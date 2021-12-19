import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { SidenavComponent } from './common/sidenav/sidenav.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HomeComponent } from './home/home.component';
import { AssignmentComponent } from './assignment/assignment/assignment.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FileComponent } from './common/file/file.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserProfileSettingsComponent } from './user/user-profile-settings/user-profile-settings.component';
import { UserProfileEditComponent } from './user/user-profile-edit/user-profile-edit.component';
import { UserSecurityComponent } from './user/user-security/user-security.component';
import { AssignmentListComponent } from './assignment/assignment-list/assignment-list.component';
import { AssignmentItemComponent } from './assignment/assignment-item/assignment-item.component';
import { NewCommentComponent } from './comment/new-comment/new-comment.component';
import { CommentListComponent } from './comment/comment-list/comment-list.component';
import { RatingModule } from 'ng-starrating';
import { UserAssignmentsPageComponent } from './assignment/user-assignments-page/user-assignments-page.component';
import { AllAssignmentsPageComponent } from './assignment/all-assignments-page/all-assignments-page.component';
import { AssignmentsFilterComponent } from './assignment/assignments-filter/assignments-filter.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SpinnerOverlayComponent } from './common/spinner-overlay/spinner-overlay.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    SidenavComponent,
    HomeComponent,
    AssignmentComponent,
    FileComponent,
    UserProfileComponent,
    UserProfileSettingsComponent,
    UserProfileEditComponent,
    UserSecurityComponent,
    AssignmentListComponent,
    AssignmentItemComponent,
    NewCommentComponent,
    CommentListComponent,
    UserAssignmentsPageComponent,
    AllAssignmentsPageComponent,
    AssignmentsFilterComponent,
    UserListComponent,
    SpinnerOverlayComponent
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
    RatingModule,
    ReactiveFormsModule,
    CommonModule,
    EditorModule
  ],
   exports:[
    NavbarComponent,
    SidenavComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,  
    AssignmentComponent,
    AssignmentItemComponent,
    AssignmentListComponent,
    FileComponent,
    UserProfileComponent,
    UserProfileSettingsComponent,
    UserProfileEditComponent,
    UserAssignmentsPageComponent,
    AllAssignmentsPageComponent,
    AssignmentsFilterComponent,
    UserListComponent,
    SpinnerOverlayComponent,
    // TODO: investigate 
    AppRoutingModule, 
    MaterialModule
   ],
   providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' }
  ]
})
export class ComponentsModule { }
