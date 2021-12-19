import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment, FilterCriteria } from 'src/app/models';
import { AssignmentService } from 'src/app/services';
import { AssignmentListComponent } from '../assignment-list/assignment-list.component';

@Component({
  selector: 'app-all-assignments-page',
  templateUrl: './all-assignments-page.component.html',
  styleUrls: ['./all-assignments-page.component.css']
})
export class AllAssignmentsPageComponent implements OnInit {

  @ViewChild(AssignmentListComponent) assignmentListComponent: AssignmentListComponent;
  constructor(private assignmentService: AssignmentService) { }
  public loadingData: boolean = false;

  ngOnInit(): void {    
    this.loadingData = true;
    this.assignmentService.getAll().subscribe(response => {
      this.assignmentListComponent.dataSourceValue = response;
      this.loadingData = false;
    }, ()=> {
      this.loadingData = false;
    });
  }

  onFilterCriteriaChanged(filterCriteria: FilterCriteria) {
    this.loadingData = true;
    this.assignmentService.filterAssigments(filterCriteria).subscribe(response => {
      this.assignmentListComponent.dataSourceValue = response;
      this.loadingData = false;
    }, () => {
      this.loadingData = false;
    })
  }

}
