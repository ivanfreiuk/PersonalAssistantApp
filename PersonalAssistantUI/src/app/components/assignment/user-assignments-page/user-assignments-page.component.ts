import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterCriteria } from 'src/app/models';
import { AssignmentService, AuthenticationService } from 'src/app/services';
import { AssignmentListComponent } from '../..';

@Component({
  selector: 'app-user-assignments-page',
  templateUrl: './user-assignments-page.component.html',
  styleUrls: ['./user-assignments-page.component.css']
})
export class UserAssignmentsPageComponent implements OnInit {

  @ViewChild(AssignmentListComponent) assignmentListComponent: AssignmentListComponent;
  public loadingData: boolean = false;

  constructor(private authService: AuthenticationService,
     private assignmentService: AssignmentService) { }

  ngOnInit(): void {
    this.loadingData = true;
    this.assignmentService.filterAssigments({ creatorId: this.authService.currentUserValue.id}).subscribe(response=> {
      this.assignmentListComponent.dataSourceValue = response;
      this.loadingData = false;
    },
    () => {
      this.loadingData = false;
    });
  }
}
