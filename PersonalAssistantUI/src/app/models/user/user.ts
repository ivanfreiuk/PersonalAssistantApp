export class User {
    public id: number;
    public firstName: string;
    public lastName: string;
    public userName: string
    public avatar: string;
    public icon: string;
    public status: string;
    public lastActiveAt: Date;
    public role: string;
    public statusMessage: string;
    public scope: string;

    public email: string;
    public sex: string;
    public location: string;
    public birthDate: Date;
    public educationalInstitutionType:string;
    public educationalInstitutionName: string;
    public password: string;
    public roleName: string;

    constructor() {
        this.id = null;
        this.userName = "";
        this.avatar = null;
        this.icon = null;
        this.status = "offline";
    }
}