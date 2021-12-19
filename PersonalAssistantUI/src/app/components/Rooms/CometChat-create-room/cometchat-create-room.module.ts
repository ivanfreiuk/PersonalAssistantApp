import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CometChatBackdrop } from "../../Shared/CometChat-backdrop/cometchat-backdrop.module";
import { CometChatCreateRoomComponent } from "./cometchat-create-room/cometchat-create-room.component";

@NgModule({
  declarations: [CometChatCreateRoomComponent],
  imports: [CommonModule, CometChatBackdrop],
  exports: [CometChatCreateRoomComponent],
})
export class CometChatCreateRoom {}
