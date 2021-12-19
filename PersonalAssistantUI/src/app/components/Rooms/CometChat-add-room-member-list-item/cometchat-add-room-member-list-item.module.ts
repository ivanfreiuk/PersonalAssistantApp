import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatAddRoomMemberListItemComponent } from "./cometchat-add-room-member-list-item/cometchat-add-room-member-list-item.component";
import { CometChatAvatar } from "../../Shared/CometChat-avatar/cometchat-avatar.module";

@NgModule({
  declarations: [CometChatAddRoomMemberListItemComponent],
  imports: [CommonModule, CometChatAvatar],
  exports: [CometChatAddRoomMemberListItemComponent],
})
export class CometChatAddGroupMemberListItem {}
