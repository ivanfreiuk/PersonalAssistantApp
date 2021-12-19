import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Room } from "src/app/models";
import { COMETCHAT_CONSTANTS } from "src/app/utils/messageConstants";
import { logger } from "../../../../utils/common";

@Component({
  selector: "cometchat-room-list-item",
  templateUrl: "./cometchat-room-list-item.component.html",
  styleUrls: ["./cometchat-room-list-item.component.css"],
})
export class CometChatRoomListItemComponent implements OnInit {
  @Input() room: Room = null;
  @Input() selectedRoom: Room = null;

  @Output() onRoomClick: EventEmitter<Room> = new EventEmitter<Room>();

  MEMBERS_COUNT: string = COMETCHAT_CONSTANTS.MEMBERS_COUNT;
  
  constructor() {}

  ngOnInit() {}

  roomClicked(room: Room) {
    try {
      this.onRoomClick.emit(room);
    } catch (error) {
      logger(error);
    }
  }
}
