import { Message, Room, User } from "..";
import * as Constants from "../../utils/constants";

export class Conversation {
    public name: string;
    public icon: number;
    public conversationType: string;
    public lastMessage: Message;
    public roomId: number;
    public room: Room;
    public userId: number;
    public user: User;    
    public unreadMessageCount: number;    
}