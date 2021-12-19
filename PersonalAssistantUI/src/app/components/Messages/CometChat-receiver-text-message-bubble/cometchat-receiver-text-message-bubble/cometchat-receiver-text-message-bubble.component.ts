import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { checkMessageForExtensionsData } from "../../../../utils/common";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";
import * as Constants from "../../../../utils/constants";
import { ActionEvent, Message, Room, User } from "src/app/models";

@Component({
  selector: "cometchat-receiver-text-message-bubble",
  templateUrl: "./cometchat-receiver-text-message-bubble.component.html",
  styleUrls: ["./cometchat-receiver-text-message-bubble.component.css"],
})
export class CometChatReceiverTextMessageBubbleComponent implements OnInit {
  @Input() room: Room = null;
  @Input() messageDetails: Message = null;
  @Input() loggedInUser: User;

  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();
  @Input() showToolTip = true;
 
  GROUP: String = Constants.RECEIVER_TYPE.GROUP;

  constructor() {}

  ngOnInit() {  }
  
  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
   messageActionHandler(action: ActionEvent) {
    try {
      this.messageActionGenerated.emit(action);
    } catch (error) {
      logger(error);
    }
  }
}
