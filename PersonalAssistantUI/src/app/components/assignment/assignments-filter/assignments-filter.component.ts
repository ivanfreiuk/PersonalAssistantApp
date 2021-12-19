import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Discipline, FilterCriteria } from 'src/app/models';
import { AssignmentTypeService, DisciplineService } from 'src/app/services';

@Component({
  selector: 'app-assignments-filter',
  templateUrl: './assignments-filter.component.html',
  styleUrls: ['./assignments-filter.component.css']
})
export class AssignmentsFilterComponent implements OnInit {

  @Output() filterCriteriaChanged: EventEmitter<FilterCriteria> = new EventEmitter<FilterCriteria>();

  disciplineSource: Array<Discipline>;
  assignmentTypeSource: Array<Discipline>;
  filterForm: FormGroup;
  filterCriteria: FilterCriteria;

  constructor(private disciplineService: DisciplineService, 
    private assignmentTypeService: AssignmentTypeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.disciplineService.getAll().subscribe(response=>{
      this.disciplineSource = response;
    });

    this.assignmentTypeService.getAll().subscribe(response=>{
      this.assignmentTypeSource = response;
    });

    this.filterCriteria = new FilterCriteria();
    this.initializeFormGoup(this.filterCriteria);
  }

  onSubmit() {
    this.populateFilterCriteria();
    this.filterCriteriaChanged.emit(this.filterCriteria);
  }

  private populateFilterCriteria() {
    const filterCriteriaValue = this.filterForm.value;
    this.filterCriteria.disciplineId = filterCriteriaValue.discipline;
    this.filterCriteria.assignmentTypeId = filterCriteriaValue.assignmentType;
    this.filterCriteria.topicName = filterCriteriaValue.topicName;
  }

  private initializeFormGoup(filterCriteria: FilterCriteria) {
    this.filterForm = this.formBuilder.group({
      discipline: [filterCriteria.disciplineId],
      assignmentType: [filterCriteria.assignmentTypeId],
      topicName: [filterCriteria.topicName]
    });
  }

}
