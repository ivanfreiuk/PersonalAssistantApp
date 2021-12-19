import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserFilterCriteria } from '../../models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl: string = `${environment.apiUrl}api`;

    constructor(private http: HttpClient) { }

    getUsers(filter: UserFilterCriteria) {
        return this.http.post<User[]>(`${this.apiUrl}/users/filter`, filter);
    }

    getById(id: number) {
        return this.http.get<User>(`${this.apiUrl}/users/` + id);
    }

    register(user: User) {
        return this.http.post(`${this.apiUrl}/account/register`, user);
    }

    update(user: User) {
        return this.http.put(`${this.apiUrl}/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/users/` + id);
    }
}
