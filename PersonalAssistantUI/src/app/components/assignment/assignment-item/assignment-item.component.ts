import { Component, Input, OnInit } from '@angular/core';
import { Assignment, User, Comment } from 'src/app/models';
import { AuthenticationService, CommentService } from 'src/app/services';

@Component({
  selector: 'app-assignment-item',
  templateUrl: './assignment-item.component.html',
  styleUrls: ['./assignment-item.component.css']
})
export class AssignmentItemComponent implements OnInit {

  @Input() assignment: Assignment;

  assignmentComments: Comment[];

  constructor(private authService: AuthenticationService, private commentService: CommentService) { }

  ngOnInit(): void {
    this.commentService.getByAssignmentId(this.assignment.id).subscribe(response => {
      this.assignmentComments = response;
    });
  }

  onCommentsChanged() {
    this.commentService.getByAssignmentId(this.assignment.id).subscribe(response => {
      this.assignmentComments = response;
    });
  }

}
