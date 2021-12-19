import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import * as Constants from "../../../../utils/constants";
import { Conversation, Message, User } from "src/app/models";

@Component({
  selector: "cometchat-conversation-list-item",
  templateUrl: "./cometchat-conversation-list-item.component.html",
  styleUrls: ["./cometchat-conversation-list-item.component.css"],
})
export class CometChatConversationListItemComponent
  implements OnInit, OnChanges {
  @Input() conversationDetails: Conversation = null;
  @Input() loggedInUser: User = null;
  @Output() onConversationClick: EventEmitter<Conversation> = new EventEmitter<Conversation>();

  conversationIcon: string;
  conversationName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  lastMessageName: string;

  constructor() { }

  ngOnChanges(change: SimpleChanges) {
    try {
      if (change[enums.CONVERSATION_DETAILS]) {
        if (
          change[enums.CONVERSATION_DETAILS].currentValue !==
          change[enums.CONVERSATION_DETAILS].previousValue
        ) {
          this.getConversationIcon(change[enums.CONVERSATION_DETAILS].currentValue)
          this.getConversationName(change[enums.CONVERSATION_DETAILS].currentValue);
          this.getLastMessage(change[enums.CONVERSATION_DETAILS].currentValue);
          this.getLastMessageTimestamp(change[enums.CONVERSATION_DETAILS].currentValue);
          this.getName(change[enums.CONVERSATION_DETAILS].currentValue);
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.getConversationIcon(this.conversationDetails);
      this.getConversationName(this.conversationDetails);
      this.getLastMessage(this.conversationDetails);
      this.getLastMessageTimestamp(this.conversationDetails);
      this.getName(this.conversationDetails);
    } catch (error) {
      logger(error);
    }
  }

  getConversationName(conversation: Conversation) {
    this.conversationName = conversation.conversationType === Constants.RECEIVER_TYPE.USER ?
      `${conversation.user.firstName} ${conversation.user.lastName}` :
      conversation.room.name;
    this.conversationName;
  }

  getConversationIcon(conversation: Conversation) {
    this.conversationName = conversation.conversationType === Constants.RECEIVER_TYPE.USER ?
      conversation.user.avatar :
      conversation.room.icon;
    return this.conversationIcon;
  }

  /**
   * Gets Name of Last Conversation
   * @param
   */
  getName(conversation: Conversation) {
    try {
      this.lastMessageName = conversation.name;
      return this.lastMessageName;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Gets the Last Conversation with user
   * @param
   */
  getLastMessage(conversation: Conversation) {
    try {
      if (conversation === null || conversation.lastMessage === null) {
        return false;
      }

      let message: string = null;
      const lastMessage = conversation.lastMessage;

      if (lastMessage.deletedAt) {
        message = this.loggedInUser.id === lastMessage.senderId
          ? COMETCHAT_CONSTANTS.YOU_DELETED_THIS_MESSAGE
          : COMETCHAT_CONSTANTS.THIS_MESSAGE_DELETED;
      } else {
        message = this.getMessage(lastMessage);
      }
      this.lastMessage = message;
      return this.lastMessage;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Gets Time when the last conversation was done
   * @param
   */
  getLastMessageTimestamp(conversation: Conversation) {
    try {
      if (conversation === null || conversation.lastMessage === null || conversation.lastMessage.sentAt === null) {
        return false;
      }

      let timestamp = null;

      const messageTimestamp: any = conversation.lastMessage.sentAt;
      const currentTimestamp = Date.now();
      const diffTimestamp: number = currentTimestamp - messageTimestamp;
      if (diffTimestamp < 24 * 60 * 60 * 1000) {
        timestamp = new Date(messageTimestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      } else if (diffTimestamp < 48 * 60 * 60 * 1000) {
        timestamp = COMETCHAT_CONSTANTS.YESTERDAY;
      } else if (diffTimestamp < 7 * 24 * 60 * 60 * 1000) {
        timestamp = new Date(messageTimestamp).toLocaleString("en-US", {
          weekday: "long",
        });
      } else {
        timestamp = new Date(messageTimestamp).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });
      }
      this.lastMessageTimestamp = timestamp;
      return this.lastMessageTimestamp;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Gets the MessageType i.e if text then display text else displays image,video,etc
   * @param
   */
  getMessage(lastMessage: Message) {
    try {
      let message: string = null;
      switch (lastMessage.type) {
        case Constants.MESSAGE_TYPE.TEXT:
          message = lastMessage.text;
          break;
        case Constants.MESSAGE_TYPE.MEDIA:
          message = COMETCHAT_CONSTANTS.MEDIA_MESSAGE;
          break;
        case Constants.MESSAGE_TYPE.IMAGE:
          message = COMETCHAT_CONSTANTS.MESSAGE_IMAGE;
          break;
        case Constants.MESSAGE_TYPE.FILE:
          message = COMETCHAT_CONSTANTS.MESSAGE_FILE;
          break;
        case Constants.MESSAGE_TYPE.VIDEO:
          message = COMETCHAT_CONSTANTS.MESSAGE_VIDEO;
          break;
        case Constants.MESSAGE_TYPE.AUDIO:
          message = COMETCHAT_CONSTANTS.MESSAGE_AUDIO;
          break;
        case Constants.MESSAGE_TYPE.CUSTOM:
          message = COMETCHAT_CONSTANTS.CUSTOM_MESSAGE;
          break;
        default:
          message = lastMessage?.text;
          break;
      }
      return message;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Emitting the user clicked so that it can be used in the parent component
   * @param Conversation conversation
   */
  onConversationClicked(conversation: Conversation) {
    try {
      this.onConversationClick.emit(conversation);
    } catch (error) {
      logger(error);
    }
  }
}
