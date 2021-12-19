import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/helpers';

@Component({
  selector: 'app-user-security',
  templateUrl: './user-security.component.html',
  styleUrls: ['./user-security.component.css']
})
export class UserSecurityComponent implements OnInit {
  currentPasswordHide: boolean = true;
  newPasswordHide: boolean = true;
  confirmPasswordHide: boolean = true;
  
  securityForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.securityForm = this.formBuilder.group({
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    },
    { validator: MustMatch('newPassword', 'confirmPassword') })
  }

   // convenience getter for easy access to form fields
   get controls() { return this.securityForm.controls; }

   onSave() {
     this.showNotification("Save button clicked", "Закрити")
   }
 
   showNotification(message: string, action: string) {
     this.snackBar.open(message, action, {
       duration: 5000,
     });
   }
}
