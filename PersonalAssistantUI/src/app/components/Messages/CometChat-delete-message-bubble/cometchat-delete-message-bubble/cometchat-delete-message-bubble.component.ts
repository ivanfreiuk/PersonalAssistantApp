import { Component, Input, OnInit } from "@angular/core";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import * as Constants from "../../../../utils/constants";
import { Message, User } from "src/app/models";

@Component({
  selector: "cometchat-delete-message-bubble",
  templateUrl: "./cometchat-delete-message-bubble.component.html",
  styleUrls: ["./cometchat-delete-message-bubble.component.css"],
})
export class CometChatDeleteMessageBubbleComponent implements OnInit {
  @Input() messageDetails: Message = null;
  @Input() loggedInUser: User = null;

  loggedInUserDeletedThisMessage: boolean = false;

  GROUP: string = Constants.RECEIVER_TYPE.GROUP;
  THIS_MESSAGE_DELETED: string = COMETCHAT_CONSTANTS.THIS_MESSAGE_DELETED;
  YOU_DELETED_THIS_MESSAGE: string = COMETCHAT_CONSTANTS.YOU_DELETED_THIS_MESSAGE;

  constructor() { }

  ngOnInit() {
    if (this.messageDetails.deletedBy === this.loggedInUser.id) {
      this.loggedInUserDeletedThisMessage = true;
    }
  }
}
