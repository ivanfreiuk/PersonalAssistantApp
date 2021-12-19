import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatViewRoomMemberListComponent } from "./cometchat-view-room-member-list/cometchat-view-room-member-list.component";
import { CometChatBackdrop } from "../../Shared/CometChat-backdrop/cometchat-backdrop.module";
import { CometChatViewRoomMemberListItem } from "../CometChat-view-room-member-list-item/cometchat-view-room-member-list-item.module";

@NgModule({
  declarations: [CometChatViewRoomMemberListComponent],
  imports: [CommonModule, CometChatBackdrop, CometChatViewRoomMemberListItem],
  exports: [CometChatViewRoomMemberListComponent],
})
export class CometChatViewRoomMemberList {}
