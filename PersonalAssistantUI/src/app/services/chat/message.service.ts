import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message, MessageFilterCriteria } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from '..';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl: string = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
   }

  getMessages(filter: MessageFilterCriteria): Observable<Array<Message>> {
     return this.http.post<Array<Message>>(`${this.apiUrl}api/messages/filter`, filter);
   }
}
