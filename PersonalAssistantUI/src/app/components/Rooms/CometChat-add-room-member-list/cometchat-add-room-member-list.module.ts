import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatAddRoomMemberListComponent } from "./cometchat-add-room-member-list/cometchat-add-room-member-list.component";
import { CometChatBackdrop } from "../../Shared/CometChat-backdrop/cometchat-backdrop.module";
import { CometChatAddGroupMemberListItem } from "../CometChat-add-room-member-list-item/cometchat-add-room-member-list-item.module";

@NgModule({
  declarations: [CometChatAddRoomMemberListComponent],
  imports: [CommonModule, CometChatBackdrop, CometChatAddGroupMemberListItem],
  exports: [CometChatAddRoomMemberListComponent],
})
export class CometChatAddRoomMemberList {}
