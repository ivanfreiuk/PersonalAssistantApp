import { BaseFilterCriteria } from "../common/base-filter-criteria";

export class RoomMemberFilterCriteria extends BaseFilterCriteria {
    public roomId?: number;
    public searchKeyword?: string;
}