import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FileQueueObject, FileService } from 'src/app/services';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  displayedColumns: string[] = ['name', 'action'];

  @Output() onCompleteItem = new EventEmitter();

  dataSource: Observable<FileQueueObject[]>;

  constructor(public fileService: FileService) { }

  ngOnInit(): void {
    this.dataSource = this.fileService.queue;
    // TODO !!! this.uploader.onCompleteItem = this.completeItem;
  }

  

  addToQueue() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      this.fileService.addToQueue(fileUpload.files);
    };
    
    fileUpload.click();
  }
}
