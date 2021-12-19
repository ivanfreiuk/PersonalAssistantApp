import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssignmentType } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentTypeService {
  
  private apiUrl: string = `${environment.apiUrl}api`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<AssignmentType[]> {
    return this.http.get<AssignmentType[]>(`${this.apiUrl}/assignment-types`)
  }

  getById(id: number): Observable<AssignmentType> {
    return this.http.get<AssignmentType>(`${this.apiUrl}/assignment-types/${id}`);
  }

  post(assignmentType: AssignmentType) {
    return this.http.post(`${this.apiUrl}assignment-types`, assignmentType);
  }

  update(assignmentType: AssignmentType) {
    return this.http.put(`${this.apiUrl}assignment-types/${assignmentType.id}`, assignmentType);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/assignment-types/${id}`);
  }
}
