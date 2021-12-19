import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {  logger } from "../../../../utils/common";
import { ActionEvent, Message, User } from "src/app/models";

@Component({
  selector: "cometchat-sender-text-message-bubble",
  templateUrl: "./cometchat-sender-text-message-bubble.component.html",
  styleUrls: ["./cometchat-sender-text-message-bubble.component.css"],
})
export class CometChatSenderTextMessageBubbleComponent implements OnInit {
  @Input() messageDetails: Message = null;
  @Input() showReplyCount: boolean = true;
  @Input() loggedInUser: User;
  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  @Input() showToolTip = true;

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
