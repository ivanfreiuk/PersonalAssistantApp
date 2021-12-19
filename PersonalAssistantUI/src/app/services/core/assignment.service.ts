import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignment, FilterCriteria } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl: string = `${environment.apiUrl}api`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments`)
  }

  getById(id: number): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/assignments/${id}`);
  }

  filterAssigments(filterCriteria: FilterCriteria): Observable<Assignment[]> {
    return this.http.post<Assignment[]>(`${this.apiUrl}/assignments/filter`, filterCriteria);
  }

  post(assignment: Assignment) {
    return this.http.post(`${this.apiUrl}/assignments`, assignment);
  }

  update(assignment: Assignment) {
    return this.http.put(`${this.apiUrl}/assignments/${assignment.id}`, assignment);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/assignments/${id}`);
  }
}
