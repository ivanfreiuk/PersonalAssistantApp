import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";
import { ActionEvent, User } from "src/app/models";

@Component({
  selector: "cometchat-add-room-member-list-item",
  templateUrl: "./cometchat-add-room-member-list-item.component.html",
  styleUrls: ["./cometchat-add-room-member-list-item.component.css"],
})
export class CometChatAddRoomMemberListItemComponent implements OnInit {
  @Input() user: User = null;
  @Input() members: User[] = null;

  checked: boolean = false;

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  constructor() {}

  ngOnInit() {
    try {
      const index = this.members.findIndex(
        (member) => member.id === this.user.id
      );
      this.checked = index > -1;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * toggle the checkbox for each users , that is, to add them or not to add them in the group
   * @param Event event
   */
  handleCheck(event) {
    try {
      this.checked = !this.checked;

      this.actionGenerated.emit({
        type: enums.MEMBER_UPDATED,
        payload: { user: this.user, userState: this.checked },
      });
    } catch (error) {
      logger(error);
    }
  }
}
