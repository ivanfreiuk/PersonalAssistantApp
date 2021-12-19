import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models';
import { AuthenticationService, UserService } from 'src/app/services';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
})
export class UserProfileEditComponent implements OnInit {

  avatarURL: any = 'assets/images/my-avatar.png';
  userDetailsForm: FormGroup;
  currentUser: User;

  constructor( private authService: AuthenticationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
     this.userService.getById(this.authService.currentUserValue.id).subscribe(response=> {
       this.currentUser = response;
       this.createUserDetailsForm(this.currentUser);
     });
  }

  // convenience getter for easy access to form fields
  get controls() { return this.userDetailsForm.controls; }

  onSave() {    
    this.populateUserDate();
    this.userService.update(this.currentUser).subscribe(()=>{
      this.showNotification("Нові зміни успішно збережено.", "Закрити")
    });
  }

  populateUserDate() {
     const newUserDetails = this.userDetailsForm.value;
     this.currentUser.firstName = newUserDetails.firstName; 
     this.currentUser.lastName = newUserDetails.lastName; 
     this.currentUser.email = newUserDetails.email; 
     this.currentUser.sex = newUserDetails.sex; 
     this.currentUser.location = newUserDetails.location; 
     this.currentUser.birthDate = newUserDetails.birthDate; 
     this.currentUser.educationalInstitutionType = newUserDetails.educationalInstitutionType; 
     this.currentUser.educationalInstitutionName = newUserDetails.educationalInstitutionName; 
  }

  createUserDetailsForm(user: User) {
    this.userDetailsForm = this.formBuilder.group({
      firstName: [user.firstName],
      lastName: [user.lastName],
      //sex: [user.sex],
      email: [user.email, [Validators.email]],
      birthDate: [], 
      location: [user.location],
      educationalInstitutionType: [user.educationalInstitutionType],
      educationalInstitutionName: [user.educationalInstitutionName]
    })
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
