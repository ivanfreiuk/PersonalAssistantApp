import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatRoomDetailsComponent } from "./cometchat-room-details/cometchat-room-details.component";
import { CometChatSharedMedia } from "../../Shared/CometChat-shared-media/cometchat-shared-media-view.module";
import { CometChatViewRoomMemberList } from "../CometChat-view-room-member-list/cometchat-view-room-member-list.module";
import { CometChatAddRoomMemberList } from "../CometChat-add-room-member-list/cometchat-add-room-member-list.module";
//import { CometChatBanGroupMemberListItem } from "../CometChat-ban-group-member-list-item/cometchat-ban-group-member-list-item.module";
//import { CometChatAddGroupMemberList } from "../CometChat-add-group-member-list/cometchat-add-group-member-list.module";

@NgModule({
  declarations: [CometChatRoomDetailsComponent],
  imports: [
    CommonModule,
    CometChatSharedMedia,
    CometChatViewRoomMemberList,
    //CometChatBanGroupMemberListItem,
    CometChatAddRoomMemberList,
  ],
  exports: [CometChatRoomDetailsComponent],
})
export class CometChatRoomDetails {}
