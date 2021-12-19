import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Discipline } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {
  
  private apiUrl: string = `${environment.apiUrl}api`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/disciplines`)
  }

  getById(id: number): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.apiUrl}/disciplines/${id}`);
  }

  post(discipline: Discipline) {
    return this.http.post(`${this.apiUrl}/disciplines`, discipline);
  }

  update(discipline: Discipline) {
    return this.http.put(`${this.apiUrl}/disciplines/${discipline.id}`, discipline);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/disciplines/${id}`);
  }
}
