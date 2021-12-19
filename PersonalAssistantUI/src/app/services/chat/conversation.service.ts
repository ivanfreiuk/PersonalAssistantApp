import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation, ConversationFilterCriteria, } from '../../models';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {

    private apiUrl: string = `${environment.apiUrl}api`;

    constructor(private http: HttpClient) { }

    getConversations(filter: ConversationFilterCriteria) {
        return this.http.post<Conversation[]>(`${this.apiUrl}/conversations/filter`, filter);
    }
}
