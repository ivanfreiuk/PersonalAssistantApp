import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import * as enums from "../../../../utils/enums";
import * as Constants from "../../../../utils/constants";
import { logger } from "../../../../utils/common";
import { AuthenticationService } from "src/app/services";
import { ActionEvent, Message } from "src/app/models";
@Component({
  selector: "cometchat-message-actions",
  templateUrl: "./cometchat-message-actions.component.html",
  styleUrls: ["./cometchat-message-actions.component.css"],
})
export class CometChatMessageActionsComponent implements OnInit {
  @Input() messageDetails: Message = null;
  @Input() showToolTip: boolean = true;
  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  showEditButton: boolean = true;
  receivedMessage: boolean = false;

  MESSAGE_TYPE_TEXT: String = Constants.MESSAGE_TYPE.TEXT;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    try {
      // for the message that is received , only show the remove button in tooltip
      if (this.messageDetails.senderId !== this.authService.currentUserValue.id) {
        this.showEditButton = false;
        this.receivedMessage = true;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Generates an action to edit  the current message
   *
   */
  editMessage() {
    try {
      this.messageActionGenerated.emit({
        type: enums.EDIT_MESSAGE,
        payload: this.messageDetails,
      });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Generates an action to Delete  the current message
   *
   */
  deleteMessage() {
    try {
      this.messageActionGenerated.emit({
        type: enums.DELETE_MESSAGE,
        payload: this.messageDetails,
      });
    } catch (error) {
      logger(error);
    }
  }
}
