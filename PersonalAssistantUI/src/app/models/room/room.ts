import { User } from "..";

export class Room {
    public id: number;
    public name: string;
    public icon: string; 
    public conversationType: string;
    public roomType: string;
    public password: string;
    public hasJoined: boolean;
    public scope: string;
    public ownerId: number;
    public owner: User;
    public createdAt: Date;
    public updatedAt: Date;
    public membersCount: number;
    public members: User[]

    constructor(name: string, type: string, conversationType: string, ownerId: number, password: string = null) {
        this.ownerId = ownerId;
        this.name = name;
        this.roomType = type;
        this.conversationType = conversationType;
        this.password = password;        
    }
}
