import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models';
import { UserService } from 'src/app/services';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  usersSource: User[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
      //this.userService.getAll().subscribe(response => this.usersSource = response );
  }

}
