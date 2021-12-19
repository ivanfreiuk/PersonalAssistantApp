import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatRoomListComponent } from "./cometchat-room-list/cometchat-room-list.component";
import { CometChatRoomListItem } from "../CometChat-room-list-item/cometchat-room-list-item.module";
import { CometChatCreateRoom } from "../CometChat-create-room/cometchat-create-room.module";

@NgModule({
  declarations: [CometChatRoomListComponent],
  imports: [CommonModule, CometChatRoomListItem, CometChatCreateRoom],
  exports: [CometChatRoomListComponent],
})
export class CometChatRoomList {}
