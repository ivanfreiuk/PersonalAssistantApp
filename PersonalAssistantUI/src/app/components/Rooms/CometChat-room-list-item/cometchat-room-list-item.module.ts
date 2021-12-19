import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatRoomListItemComponent } from "./cometchat-room-list-item/cometchat-room-list-item.component";
import { CometChatAvatar } from "../../Shared/CometChat-avatar/cometchat-avatar.module";
@NgModule({
  declarations: [CometChatRoomListItemComponent],
  imports: [CommonModule, CometChatAvatar],
  exports: [CometChatRoomListItemComponent],
})
export class CometChatRoomListItem {}
