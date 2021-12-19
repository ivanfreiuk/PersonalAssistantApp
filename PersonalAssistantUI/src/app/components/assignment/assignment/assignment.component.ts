import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Assignment, AssignmentType, Discipline } from 'src/app/models';
import { AssignmentService, AssignmentTypeService, AuthenticationService, DisciplineService } from 'src/app/services';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  public assignmentTypeSource: Array<AssignmentType>;
  public disciplineSource: Array<Discipline>;
  public currentAssignment: Assignment;

  public assignmentForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private assignmentService: AssignmentService,
    private disciplineService: DisciplineService,
    private assignmentTypeService: AssignmentTypeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.disciplineService.getAll().subscribe(response=>{
      this.disciplineSource = response;
    });

    this.assignmentTypeService.getAll().subscribe(response=>{
      this.assignmentTypeSource = response;
    });

    this.currentAssignment = new Assignment();
    this.assignmentForm = this.createFormGroup(this.currentAssignment)
  }

  onFileUpload() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
     fileUpload.onchange = () => {
    //   this.imageFile = fileUpload.files[0];
    //   this.setImageURL(this.imageFile);
    };
    fileUpload.click();
  }

  onSubmit() {
    if (this.assignmentForm.invalid) {
      this.showNotification('Помилка! Некоректно введені дані.', 'Закрити')
      return;
    }

    this.populateAssignmentData();
    this.assignmentService.post(this.currentAssignment).subscribe(() => {
      this.showNotification('Нове завдання успішно додане.', 'Закрити')
      this.router.navigate(['/my-assignments']);
    },
    error=>{
        console.log(error);
    });
  }

  populateAssignmentData() {
    const assignmentValue = this.assignmentForm.value;
    this.currentAssignment.creatorId = this.authService.currentUserValue?.id;
    this.currentAssignment.topicName = assignmentValue.topicName;
    this.currentAssignment.disciplineId = assignmentValue.discipline;
    this.currentAssignment.assignmentTypeId = assignmentValue.assignmentType;
    this.currentAssignment.preferredDeadline = assignmentValue.preferredDeadline;
    this.currentAssignment.details = assignmentValue.details;
  }

  createFormGroup(assignment: Assignment) {
    return this.formBuilder.group({
      topicName: [assignment.topicName],
      discipline: [assignment.disciplineId],
      assignmentType: [assignment.assignmentTypeId],
      preferredDeadline: [assignment.preferredDeadline],
      details: [assignment.details]
    });
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
