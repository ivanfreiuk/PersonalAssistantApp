import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
//import { CometChat } from "@cometchat-pro/chat";
import { INCOMING_MESSAGE_SOUND } from "../../../../resources/audio/incomingMessageSound";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";
import { ActionEvent, Message, Room } from "src/app/models";
import { AuthenticationService, SignalRService } from "src/app/services";
@Component({
  selector: "cometchat-messages",
  templateUrl: "./cometchat-messages.component.html",
  styleUrls: ["./cometchat-messages.component.css"],
})
export class CometChatMessagesComponent implements OnInit, OnChanges {
  @ViewChild("messageWindow", { static: false }) chatWindow: ElementRef;

  @Input() room: Room = null;
  @Input() composedThreadMessage = null;
  @Input() groupMessage = null;

  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();
  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();
  
  userOnlineSubscription: any;
  userOfflineSubscription: any;

  messageList: Message[] = [];
  messageToBeEdited: Message = null;
  changeNumber = 0;
  reachedTopOfConversation = false;
  scrollVariable = 0;

  constructor(private signalRService: SignalRService, private authService: AuthenticationService) {}

  ngOnChanges(change: SimpleChanges) {
    try {   
      if (change[enums.GROUP_MESSAGE]) {
        if (change[enums.GROUP_MESSAGE].currentValue.length > 0) {
          this.appendMessage(change[enums.GROUP_MESSAGE].currentValue);
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {  }

  messageActionHandler(action: ActionEvent) {
    const message = action.payload;
    switch (action.type) {
      case enums.MESSAGE_RECEIVED: {
        setTimeout(() => {
          this.scrollToBottomOfChatWindow();
        }, 2500);
        this.scrollToBottomOfChatWindow(); 
        this.playAudio();
        break;
      }
      case enums.MESSAGE_COMPOSED: {
        //this.appendMessage(message);
        this.messageActionGenerated.emit({
          type: enums.MESSAGE_COMPOSED,
          payload: message,
        });
        break;
      }
      case enums.EDIT_MESSAGE: {
        this.editMessage(message);
        break;
      }
      case enums.MESSAGE_EDITED: {
        this.messageEdited(message);
        break;
      }
      case enums.DELETE_MESSAGE: {
        this.deleteMessage(message);
        break;
      }
    }
  }

  actionEventHandler(action: ActionEvent) {
    switch (action.type) {
      case enums.VIEW_DETAIL:
      case enums.MENU_CLICKED: {
        this.actionGenerated.emit(action);
        break;
      }
    }
  }

  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action: ActionEvent) {
    try {
      let messages = action.payload;
      let message = action.payload;
      let data = action.payload;

      switch (action.type) {
        case enums.CUSTOM_MESSAGE_RECEIVE: {
          const message = messages;
            setTimeout(() => {
              this.scrollToBottomOfChatWindow();
            }, 2500);

            this.appendMessage(message);

          this.playAudio();

          break;
        }

        case enums.MESSAGE_FETCHED: {
          this.prependMessages(messages);
          break;
        }
        case enums.OLDER_MESSAGES_FETCHED: {
          this.reachedTopOfConversation = false;

          //No Need for below actions if there is nothing to prepend
          if (messages.length == 0) break;

          let prevScrollHeight = this.chatWindow.nativeElement.scrollHeight;

          this.prependMessages(messages);

          setTimeout(() => {
            this.chatWindow.nativeElement.scrollTop =
              this.chatWindow.nativeElement.scrollHeight - prevScrollHeight;
          });

          break;
        }
        
        case enums.VIEW_ACTUAL_IMAGE: {
          this.actionGenerated.emit({
            type: enums.VIEW_ACTUAL_IMAGE,
            payLoad: messages,
          });
          break;
        }
        case enums.NEW_CONVERSATION_OPENED: {
          this.resetPage();
          this.setMessages(messages);

          break;
        }
        case enums.DELETE_MESSAGE: {
          this.deleteMessage(messages);
          break;
        }
        case enums.EDIT_MESSAGE: {
          this.editMessage(messages);
          break;
        }
        
        case enums.VIEW_DETAIL:
        case enums.MENU_CLICKED: {
          this.actionGenerated.emit(action);
          break;
        }
        case enums.CLEAR_MESSAGE_TO_BE_UPDATED: {
          this.messageToBeEdited = null;
          break;
        }

        case enums.MESSAGE_DELETE: {
          this.removeMessage(messages);
          break;
        }
        case enums.GROUP_UPDATED:
          this.groupUpdated(data.message, data.key, data.group, data.options);
          break;
      }
    } catch (error) {
      logger(error);
    }
  }


  /**
   * Resets The component to initial conditions
   * @param
   */
  resetPage() {
    try {
      this.messageToBeEdited = null;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * set Messages Directly , coz new conversation is opened , hence no need to prepend or append
   * @param Any messages
   */
  setMessages(messages: Message[]) {
    try {
      this.messageList = [...messages];

      this.scrollToBottomOfChatWindow();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * prepend Fetched Messages
   * @param Any messages
   */
  prependMessages(messages) {
    try {
      this.messageList = [...messages, ...this.messageList];
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Append message that are sent
   * @param Message message
   */
  appendMessage(message: Message) {
    try {
      this.messageList.push(message)
      this.scrollToBottomOfChatWindow();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Delete the message
   * @param Any message
   */
  deleteMessage(message: Message) {
    try {
      this.signalRService.removeMessage(message.id)
        .then((deletedMessage) => {
          const messageIndex = this.messageList.findIndex(m => m.id === message.id);
          if (messageIndex > -1) {
            this.messageList.splice(messageIndex, 1, deletedMessage)
          }

          const isLastMessage = this.messageList.length - messageIndex === 1;
          if (isLastMessage) {
            this.messageActionGenerated.emit({
              type: enums.MESSAGE_DELETE,
              payload: deletedMessage,
            });
          }
        })
        .catch((error) => {
          logger("Message delete failed with error:", error);
        });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Sets The message to be edited to pass it to the message composer
   * @param Any messages
   */
  editMessage(message: Message) {
    try {
      this.messageToBeEdited = message;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Render The Message List after Message has been successfullly edited
   * @param Any message
   */
  messageEdited(message: Message) {
    try {
      const messageIndex = this.messageList.findIndex(m => m.id === message.id);
      if (messageIndex > -1) {
        this.messageList[messageIndex] = message;
      }

      const isLastMessage = this.messageList.length - messageIndex === 1;
      if (isLastMessage) {
        this.messageActionGenerated.emit({
          type: enums.MESSAGE_EDITED,
          payload: message,
        });
      }      
    } catch (error) {
      logger(error);
    }
  }

  /**
   * If the message gets deleted successfull , remove the deleted message in frontend using this function
   * @param Any messages
   */
  removeMessage(message: Message) {
    try {
      const messagelist = [...this.messageList];

      let messageKey = messagelist.findIndex(
        (message) => message.id === message.id
      );
      if (messageKey > -1) {
        let messageObj = { ...messagelist[messageKey] };
        let newMessageObj = Object.assign({}, messageObj, message);

        messagelist.splice(messageKey, 1, newMessageObj);

        this.messageList = [...messagelist];
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * Handles scroll of window
   * @param e
   */
  handleScroll(event) {
    try {
      const bottom =
        Math.round(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) ===
        Math.round(event.currentTarget.clientHeight);

      const top = event.currentTarget.scrollTop === 0;

      if (top) {
        this.reachedTopOfConversation = top;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Scrolls to bottom of chat window
   */
  scrollToBottomOfChatWindow() {
    try {
      setTimeout(() => {
        this.chatWindow.nativeElement.scrollTop =
          this.chatWindow.nativeElement.scrollHeight -
          this.chatWindow.nativeElement.clientHeight;
      });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Plays Audio When Message is Sent
   */
  playAudio() {
    try {
      let audio = new Audio();
      audio.src = INCOMING_MESSAGE_SOUND;
      audio.play();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Emits an Action Indicating that Group Data has been updated
   * @param
   */
  groupUpdated(message, key, group, options) {
    try {
      this.appendMessage(message);

      this.actionGenerated.emit({
        type: enums.GROUP_UPDATED,
        payLoad: { message, key, group, options },
      });
    } catch (error) {
      logger(error);
    }
  };   
}
