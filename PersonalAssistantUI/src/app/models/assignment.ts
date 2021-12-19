import { AssignmentType } from "./assignment-type";
import { Discipline } from "./discipline";
import { User } from "./user/user";

export class Assignment {
    public id: number;
    public creatorId: number;
    public creator: User;
    public executorId: number;
    public executor: User;
    public topicName: string;
    public preferredDeadline: Date;
    public disciplineId: number;
    public discipline: Discipline;
    public assignmentTypeId: number;
    public assignmentType: AssignmentType;
    public details: string;

    constructor() {
        this.id = 0;
        this.creatorId = null;
        this.executorId = null;
        this.topicName = '';
        this.preferredDeadline = new Date();
        this.disciplineId = null;
        this.discipline = null;
        this.assignmentTypeId = null;
        this.assignmentType = null;
        this.details = '';
    }
}