import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/helpers';
import { User } from 'src/app/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide: boolean = true;
  registerForm: FormGroup;

  constructor(private userSvc: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
      { validator: MustMatch('password', 'confirmPassword') })
  }

  // convenience getter for easy access to form fields
  get controls() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const user: User = new User()
    user.firstName = this.controls.firstName.value;
    user.lastName = this.controls.lastName.value;
    user.email = this.controls.email.value;
    user.password = this.controls.password.value;      
    
    this.userSvc.register(user)
    .pipe(first())
      .subscribe(() => {
        
        this.showNotification('Ваш аккаунт успішно створено.', 'Закрити');
        this.router.navigate(['/login'])
      },
      error => {
        console.log(error)
        this.showNotification('Помилка! Не вдалося створити новий аккаунт.', 'Закрити')
      });
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
