import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Assignment } from 'src/app/models';
import { AssignmentService, AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {

 @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() loadingData: boolean = false;
  public dataSource: MatTableDataSource<Assignment> = new MatTableDataSource<Assignment>();

  constructor(public authService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  get dataSourceValue() {
    return this.dataSource.data;
  }

  set dataSourceValue(value: Array<Assignment>) {
    this.dataSource.data = value;
  }


  ngOnInit(): void {
      this.changeDetectorRef.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.connect();  
  }

}
