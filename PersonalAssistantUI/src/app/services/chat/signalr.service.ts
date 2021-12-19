import { EventEmitter, Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message, Room, User } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private apiUrl: string = `${environment.apiUrl}`;
  private hubConnection: HubConnection

  public receivedMessageEvent: EventEmitter<Message>;
  public editedMessageEvent: EventEmitter<Message>;
  public removedMessageEvent: EventEmitter<Message>;

  public roomCreatedEvent: EventEmitter<Room>;
  public roomMembersAddedEvent: EventEmitter<Room>;
  public roomMemberRemovedEvent: EventEmitter<User>;
  public roomMemberJoinedEvent: EventEmitter<User>;

  public userOnlineEvent: EventEmitter<Number>;
  public userOfflineEvent: EventEmitter<Number>;

  constructor() {
    this.receivedMessageEvent = new EventEmitter<Message>();
    this.editedMessageEvent = new EventEmitter<Message>();
    this.removedMessageEvent = new EventEmitter<Message>();

    this.roomCreatedEvent = new EventEmitter<Room>();
    this.roomMembersAddedEvent = new EventEmitter<Room>();
    this.roomMemberRemovedEvent = new EventEmitter<User>();
    this.roomMemberJoinedEvent = new EventEmitter<User>();

    this.userOnlineEvent = new EventEmitter<Number>();
    this.userOfflineEvent = new EventEmitter<Number>();
    this.initializeConnection();
    this.registerOnServerEvents();
  }

  sendMessage(message: Message): Promise<Message> {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Message>("sendMessage", message);
  }

  editMessage(message: Message): Promise<Message> {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Message>("editMessage", message);
  }

  removeMessage(messageId: number): Promise<Message> {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Message>("removeMessage", messageId);
  }

  createRoom(room: Room) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Room>("createRoom", room);
  }

  addRoomMembers(roomId: number, userIds: number[]) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<User[]>("addRoomMembers", roomId, userIds);
  }

  joinRoom(roomId: number, userId: number, password: string) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Room>("joinRoom", roomId, userId, password);
  }

  removeRoomMember(roomId: number, userId: number) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<User>("removeRoomMember", roomId, userId);
  }

  removeRoom(roomId: number) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      return this.hubConnection.invoke<Message>("removeRoom", roomId);
  }

  userOnline() {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke('userOnline');
  }

  userOffline() {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke('userOffline');
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('onReceivedMessage', (message: Message) => {
      this.receivedMessageEvent.emit(message);
    });
    this.hubConnection.on('onEditedMessage', (message: Message) => {
      this.editedMessageEvent.emit(message);
    });
    this.hubConnection.on('onRemovedMessage', (message: Message) => {
      this.removedMessageEvent.emit(message);
    });
    
    this.hubConnection.on('onRoomCreated', (room: Room) => {
      this.roomCreatedEvent.emit(room);
    });
    this.hubConnection.on('onRoomMembersAdded', (room: Room) => {
      this.roomMembersAddedEvent.emit(room);
    });
    this.hubConnection.on('onRoomMemberRemoved', (user: User) => {
      this.roomMemberRemovedEvent.emit(user);
    });
    this.hubConnection.on('onRoomMemberJoined', (user: User) => {
      this.roomMemberJoinedEvent.emit(user);
    });

    this.hubConnection.on('onUserOnline', (userId: number) => {
      this.userOnlineEvent.emit(userId);
    });
    this.hubConnection.on('onUserOffline', (userId: number) => {
      this.userOfflineEvent.emit(userId);
    });
  }

  private initializeConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.apiUrl}chat`, {
        accessTokenFactory: () => this.getAccessToken(),
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(`Error while starting SignalR connection: ${error}`));
  }

  private getAccessToken() {
    return JSON.parse(localStorage.getItem('access_token'))
  }
}
