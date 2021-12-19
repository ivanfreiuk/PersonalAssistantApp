import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models';
import { AuthenticationService, UserService } from 'src/app/services';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  userId: number;

  avatarURL: any = 'assets/images/default-user-photo.png';

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  ngOnInit(): void {
    this.userService.getById(this.userId).subscribe(response => {
      this.user = response;
    })
  }
}
