import { User } from "./user/user";

export class Comment {
    public id: number;
    public assignmentId: number;
    public userId: number;
    public user: User;
    public headline: string;
    public content: string;
    public creationDate: Date;
}