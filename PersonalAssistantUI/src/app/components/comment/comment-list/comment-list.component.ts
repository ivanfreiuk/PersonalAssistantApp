import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService, CommentService } from 'src/app/services';
import { Comment } from 'src/app/models';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input() comments: Comment[];
  @Output() onCommentDeleted = new EventEmitter();

  constructor( private authService: AuthenticationService, private commentService: CommentService) { }

  ngOnInit(): void {
  }

  userCanDelete(userId: number) {
    return this.authService.currentUserValue.id === userId;
  }

  delete(id: number) {
    this.commentService.delete(id).subscribe(()=>{
      this.onCommentDeleted.emit();
    });
  }

}
