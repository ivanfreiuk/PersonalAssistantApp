import { User } from "..";
import { Room } from "..";

export class Message {
    public id?: number;
    public senderId: number;
    public sender?: User;
    public roomId: number;
    public room?: Room;
    public receiverType: string;
    public type?: string; // TEXT
    public category?: string;
    public sentAt?: Date;
    public status?: string;
    public editedAt?: Date;
    public editedBy?: string;
    public deletedAt?: Date;
    public deletedBy?: number;
    public text: string;
    public parentMessageId?: number;

    constructor(senderId: number, roomId: number, text: string, type: string, receiverType: string) {
        this.senderId = senderId;
        this.roomId = roomId;
        this.text = text;
        this.receiverType = receiverType;
        this.type = type;
        this.sentAt = new Date(Date.now());
    }
}
