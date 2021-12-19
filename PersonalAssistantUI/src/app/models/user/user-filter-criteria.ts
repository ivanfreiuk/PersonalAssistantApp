import { BaseFilterCriteria } from "../common/base-filter-criteria";

export class UserFilterCriteria extends BaseFilterCriteria {
    public loggedInUserId?: number;
    public searchKeyword?: string;
}