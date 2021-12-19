import { BaseFilterCriteria } from "../common/base-filter-criteria";

export class RoomFilterCriteria extends BaseFilterCriteria {
    public loggedInUserId?: number;
    public searchKeyword?: string;
    public conversationType?: string;
}