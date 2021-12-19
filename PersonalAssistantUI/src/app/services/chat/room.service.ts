import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room, RoomFilterCriteria, RoomMemberFilterCriteria, User, } from '../../models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    private apiUrl: string = `${environment.apiUrl}api`;

    constructor(private http: HttpClient) { }

    getRooms(filter: RoomFilterCriteria) {
        return this.http.post<Room[]>(`${this.apiUrl}/rooms/filter`, filter);
    }

    getRoomMembers(filter: RoomMemberFilterCriteria) {
        return this.http.post<User[]>(`${this.apiUrl}/rooms/members`, filter);
    }

    createRoom(room: Room) {
      return this.http.post<Room>(`${this.apiUrl}/rooms`, room);
    }
}
