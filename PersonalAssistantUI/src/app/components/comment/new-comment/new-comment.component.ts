import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, CommentService } from 'src/app/services';
import { Comment } from 'src/app/models';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.css']
})
export class NewCommentComponent implements OnInit {

  @Input() assignmentId: number;
  @Output() onCommentAdded = new EventEmitter();
  commentForm: FormGroup;
  rating: number;
  
  constructor(public authService: AuthenticationService, private commentService:CommentService, private formBuilder: FormBuilder) { 
  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      headline: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  commentSubmit() {
    
    if (this.commentForm.invalid) {
      return;
    }
    const comment = new Comment();
    comment.assignmentId = this.assignmentId;
    comment.userId = this.authService.currentUserValue?.id;
    comment.headline = this.commentForm.controls.headline.value;
    comment.content = this.commentForm.controls.content.value;
    comment.creationDate = new Date(Date.now());    
    
     this.commentService.post(comment).subscribe(() => {
       this.onCommentAdded.emit();
       this.commentForm = this.formBuilder.group({
        headline: ['', [Validators.required]],
        content: ['', [Validators.required]]
      });
     }
    );
  }

}
