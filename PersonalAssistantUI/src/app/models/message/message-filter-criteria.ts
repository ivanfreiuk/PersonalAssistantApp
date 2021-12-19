import { BaseFilterCriteria } from "../common/base-filter-criteria";

export class MessageFilterCriteria extends BaseFilterCriteria {
    public loggedInUserId?: number;
    public roomId?: number;
    public parentMessageId?: number;
}