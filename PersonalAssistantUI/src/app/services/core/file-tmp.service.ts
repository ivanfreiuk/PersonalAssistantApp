import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  private apiUrl: string = `${environment.apiUrl}api`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/files`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/files/${id}`);
  }

  post(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append(file.name, file);
    });

    return this.http.post(`${this.apiUrl}/files`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/files/${id}`);
  }
}
