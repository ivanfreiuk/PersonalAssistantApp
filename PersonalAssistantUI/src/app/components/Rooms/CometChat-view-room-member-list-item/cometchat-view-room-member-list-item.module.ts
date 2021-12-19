import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatViewRoomMemberListItemComponent } from "./cometchat-view-room-member-list-item/cometchat-view-room-member-list-item.component";
import { CometChatAvatar } from "../../Shared/CometChat-avatar/cometchat-avatar.module";

@NgModule({
  declarations: [CometChatViewRoomMemberListItemComponent],
  imports: [CommonModule, CometChatAvatar],
  exports: [CometChatViewRoomMemberListItemComponent],
})
export class CometChatViewRoomMemberListItem {}
