import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatNavBarComponent } from "./cometchat-nav-bar/cometchat-nav-bar.component";
import { CometChatUserList } from "../../Users/CometChat-user-list/cometchat-user-list.module";
import { CometChatConversationList } from "../../Chats/CometChat-conversation-list/cometchat-conversation-list.module";
import { CometChatRoomList } from "../../Rooms/CometChat-room-list/cometchat-room-list.module";

@NgModule({
  declarations: [CometChatNavBarComponent],
  imports: [
    CommonModule,
    //CometChatUserProfile,
    CometChatUserList,
    CometChatRoomList,
    CometChatConversationList,
  ],
  exports: [CometChatNavBarComponent],
})
export class CometChatNavBar {}
