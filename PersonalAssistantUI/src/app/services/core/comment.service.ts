import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  
  private apiUrl: string = `${environment.apiUrl}api`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`)
  }

  getById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/comments/${id}`);
  }

  getByAssignmentId(assignmentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/assignment/${assignmentId}`)
  }

  post(comment: Comment) {
    return this.http.post(`${this.apiUrl}/comments`, comment);
  }

  update(comment: Comment) {
    return this.http.put(`${this.apiUrl}/comments/${comment.id}`, comment);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/comments/${id}`);
  }
}
