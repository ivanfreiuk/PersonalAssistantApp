import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { DatePipe } from "@angular/common";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import * as Constants from "../../../../utils/constants";
import { ActionEvent, Message, MessageFilterCriteria, Room, User } from "src/app/models";
import { AuthenticationService, MessageService, SignalRService } from "src/app/services";

@Component({
  selector: "cometchat-message-list",
  templateUrl: "./cometchat-message-list.component.html",
  styleUrls: ["./cometchat-message-list.component.css"],
})
export class CometChatMessageListComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() room: Room;

  @Input() messages: Message[] = [];
  @Input() reachedTopOfConversation = [];

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();
  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  receivedMessageSubscription: any;
  editedMessagesSubscription: any;
  removedMessageSubscription: any;

  messageFilterCriteria: MessageFilterCriteria;
  limit = 50;
  decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
  times = 0;
  lastScrollTop = 0;
  loggedInUser: User;
  prevUser;

  MESSAGE_TYPE_TEXT: String = Constants.MESSAGE_TYPE.TEXT;
  MESSAGE_TYPE_IMAGE: String = Constants.MESSAGE_TYPE.IMAGE;
  MESSAGE_TYPE_VIDEO: String = Constants.MESSAGE_TYPE.VIDEO;
  MESSAGE_TYPE_AUDIO: String = Constants.MESSAGE_TYPE.AUDIO;
  MESSAGE_TYPE_FILE: String = Constants.MESSAGE_TYPE.FILE;
  MESSAGE_TYPE_CUSTOM: String = Constants.MESSAGE_TYPE.CUSTOM;
  CATEGORY_MESSAGE: String = Constants.CATEGORY_MESSAGE;
  CATEGORY_ACTION: String = Constants.CATEGORY_ACTION;

  categories = [
    Constants.CATEGORY_MESSAGE,
    Constants.MESSAGE_TYPE.CUSTOM,
    Constants.CATEGORY_ACTION
  ];
  types = [
    Constants.MESSAGE_TYPE.TEXT,
    Constants.MESSAGE_TYPE.IMAGE,
    Constants.MESSAGE_TYPE.VIDEO,
    Constants.MESSAGE_TYPE.AUDIO,
    Constants.MESSAGE_TYPE.FILE,
    enums.ACTION_TYPE_GROUPMEMBER
  ];

  constructor(private ref: ChangeDetectorRef, public datepipe: DatePipe, 
    private authService: AuthenticationService, 
    private messageService: MessageService,
    private signalRService: SignalRService) {
    try {      
      setInterval(() => {
        if (!this.ref[enums.DESTROYED]) {
          this.ref.detectChanges();
        }
      }, 2500);
    } catch (error) {
      logger(error);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    try {      
      if (change[enums.ROOM]) {
        //Removing Previous Conversation Listeners
        // CometChat.removeMessageListener(this.msgListenerId);
        // CometChat.removeGroupListener(this.groupListenerId);

        this.createMessageFilterCriteriaObjectAndGetMessages();

        // Attach MessageListeners for the new conversation
        this.addMessageEventListeners();
      }

      if (change[enums.REACHED_TOP_OF_CONVERSATION]) {
        if (change[enums.REACHED_TOP_OF_CONVERSATION].currentValue) {
          this.getMessages(false, false, true);
        }
      }

      if (change[enums.MESSAGED]) {
        if (change[enums.MESSAGED].currentValue.length > 0) {
          this.decoratorMessage = "";
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.createMessageFilterCriteriaObjectAndGetMessages();

      // Attach MessageListeners Here
      this.attachMessageListeners();
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    try {
      // Removing Message Listeners
      this.removeMessageListeners()
      // CometChat.removeMessageListener(this.msgListenerId);
      // CometChat.removeGroupListener(this.groupListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Creates a Message Request object ( holding the config , that is the two user involved in conversation ) and gets all the messages
   * @param
   */
  createMessageFilterCriteriaObjectAndGetMessages() {
    try {
      this.messageFilterCriteria = this.buildFilterCriteriaObject(this.room);

      this.getMessages(false, true);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listener To Receive Messages in Real Time
   * @param
   */
  addMessageEventListeners() {
    try {
      // CometChat.addMessageListener(
      //   this.msgListenerId,
      //   new CometChat.MessageListener({
      //     onTextMessageReceived: (textMessage) => {
      //       this.messageUpdated(enums.TEXT_MESSAGE_RECEIVED, textMessage);
      //     },
      //     onMediaMessageReceived: (mediaMessage) => {
      //       this.messageUpdated(enums.MEDIA_MESSAGE_RECEIVED, mediaMessage);
      //     },
      //     onCustomMessageReceived: (customMessage) => {
      //       this.messageUpdated(enums.CUSTOM_MESSAGE_RECEIVED, customMessage);
      //     }
      //   })
      // );

      // CometChat.addGroupListener(
      //   this.groupListenerId,
      //   new CometChat.GroupListener({
      //     onGroupMemberScopeChanged: (
      //       message,
      //       changedUser,
      //       newScope,
      //       oldScope,
      //       changedGroup
      //     ) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_SCOPE_CHANGED,
      //         message,
      //         changedGroup,
      //         { user: changedUser, scope: newScope }
      //       );
      //     },
      //     onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_KICKED,
      //         message,
      //         kickedFrom,
      //         {
      //           user: kickedUser,
      //           hasJoined: false,
      //         }
      //       );
      //     },
      //     onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_BANNED,
      //         message,
      //         bannedFrom,
      //         {
      //           user: bannedUser,
      //         }
      //       );
      //     },
      //     onGroupMemberUnbanned: (
      //       message,
      //       unbannedUser,
      //       unbannedBy,
      //       unbannedFrom
      //     ) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_UNBANNED,
      //         message,
      //         unbannedFrom,
      //         { user: unbannedUser }
      //       );
      //     },
      //     onMemberAddedToGroup: (
      //       message,
      //       userAdded,
      //       userAddedBy,
      //       userAddedIn
      //     ) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_ADDED,
      //         message,
      //         userAddedIn,
      //         {
      //           user: userAdded,
      //           hasJoined: true,
      //         }
      //       );
      //     },
      //     onGroupMemberLeft: (message, leavingUser, group) => {
      //       this.messageUpdated(enums.GROUP_MEMBER_LEFT, message, group, {
      //         user: leavingUser,
      //       });
      //     },
      //     onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
      //       this.messageUpdated(
      //         enums.GROUP_MEMBER_JOINED,
      //         message,
      //         joinedGroup,
      //         {
      //           user: joinedUser,
      //         }
      //       );
      //     },
      //   })
      // );

    } catch (error) {
      logger(error);
    }
  }

  attachMessageListeners() {
    try {
      this.receivedMessageSubscription =  this.signalRService.receivedMessageEvent.subscribe((message: Message) => {
        this.onReceivedMessage(message);
      });
      this.editedMessagesSubscription =  this.signalRService.editedMessageEvent.subscribe((message: Message) => {
        this.onEditedMessage(message);
      });
      this.removedMessageSubscription =  this.signalRService.removedMessageEvent.subscribe((message: Message) => {
        this.onRemovedMessage(message);
      });

    } catch (error) {
      logger(error);
    }
  }

  removeMessageListeners() {
    try {
      this.receivedMessageSubscription.unsubscribe();
      this.editedMessagesSubscription.unsubscribe();
      this.removedMessageSubscription.unsubscribe();
    } catch (error) {
      logger(error);
    }
  }

  private onReceivedMessage(message: Message) {
      const foundMessage = this.messages.find(m => m.id === message.id);
      if(message.roomId === this.room.id && !foundMessage) {
        this.messages.push(message);

        this.messageActionGenerated.emit({
          type: enums.MESSAGE_RECEIVED,
          payload: message
        })
      }
  }

  private onEditedMessage(message: Message) {
    if(message.roomId === this.room.id && message.senderId !== this.authService.currentUserValue.id) {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index > -1) {
        this.messages[index] = message;
      }
      this.messageActionGenerated.emit({
          type: enums.MESSAGE_EDITED,
          payload: message,
        });
    }    
  }

  private onRemovedMessage(message: Message) {
    if(message.roomId === this.room.id && message.senderId !== this.authService.currentUserValue.id) {
      const index = this.messages.findIndex(m => m.id === message.id);
      if (index > -1) {
        this.messages.splice(index, 1, message)
      }
      this.messageActionGenerated.emit({
          type: enums.MESSAGE_DELETED,
          payload: message,
        });
    }  
  };

  /**
   * This Build Message Filter Criteria Object , that helps in getting messages of a particular conversation
   * @param
   */
  buildFilterCriteriaObject(room: Room): MessageFilterCriteria {
    let filterCriteria: MessageFilterCriteria;
    filterCriteria = {
      loggedInUserId: this.authService.currentUserValue.id,
      roomId: room.id,
      pageNumber: 1,
      limit: this.limit
    }

    return filterCriteria;
  }

  /**
   * Gets Messages For a particular conversation bases on MessageRequestConfig
   * @param
   */
  getMessages(scrollToBottom: boolean = false, newConversation: boolean = false, scrollToTop: boolean = false) {
    try {
      this.decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
      const actionMessages = [];

      this.loggedInUser = this.authService.currentUserValue;

      // TODO - limit page number
      this.messageService.getMessages(this.messageFilterCriteria).toPromise()
      .then((messageList: Message[]) => {
          // No Messages Found
          if (messageList.length === 0 && this.messages.length === 0) {
            this.decoratorMessage = COMETCHAT_CONSTANTS.NO_MESSAGES_FOUND;
          } else {
            this.decoratorMessage = "";
          }

          // messageList.forEach((message: Message) => {
          //   // if (
          //   //   message.category === Constants.CATEGORY_ACTION &&
          //   //   message.sender.id === enums.APP_SYSTEM
          //   // ) {
          //   //   actionMessages.push(message);
          //   // }

          //   //if the sender of the message is not the loggedin user, mark it as read.
          //   if (message.sender.id !== this.loggedInUser.id) /*&&
          //     !message.getReadAt()
          //   ) */{
          //     if (
          //       message.receiverType === Constants.RECEIVER_TYPE.USER
          //     ) {
          //       //CometChat.markAsRead(message);
          //     } else if (
          //       message.receiverType === Constants.RECEIVER_TYPE.GROUP
          //     ) {
          //       //CometChat.markAsRead(message);
          //     }

          //     this.actionGenerated.emit({
          //       type: enums.MESSAGE__READ,
          //       payLoad: message,
          //     });
          //   }
          // });

          ++this.times;

          let actionGeneratedType = enums.MESSAGE_FETCHED;
          if (scrollToBottom === true) {
            actionGeneratedType = enums.MESSAGE_FETCHED_AGAIN;
          }

          if (scrollToTop) {
            actionGeneratedType = enums.OLDER_MESSAGES_FETCHED;
          }

          // Only called when the active user changes the the conversation , that is switches to some other person
          // to chat with
          if (newConversation) {
            actionGeneratedType = enums.NEW_CONVERSATION_OPENED;
          }

          if (
            (this.times === 1 && actionMessages.length > 5) ||
            (this.times > 1 && actionMessages.length === 50)
          ) {
            this.actionGenerated.emit({
              type: enums.MESSAGE_FETCHED,
              payload: messageList,
            });
            this.getMessages(true, false);
          } else {
            this.actionGenerated.emit({
              type: actionGeneratedType,
              payload: messageList,
            });
          }
        },
        (error) => {
          logger("Message fetching failed with error:", error);
        }
      );
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates messageList on basis of user activity or group activity or calling activity
   * @param
   */
  messageUpdated(key: string = null, message: Message = null, room: Room = null, options = null) {
    try {
      switch (key) {
        case enums.GROUP_MEMBER_SCOPE_CHANGED:
        case enums.GROUP_MEMBER_JOINED:
        case enums.GROUP_MEMBER_LEFT:
        case enums.GROUP_MEMBER_ADDED:
        case enums.GROUP_MEMBER_KICKED:
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_UNBANNED: {
          this.groupUpdated(key, message, room, options);
          break;
        }
      }
    } catch (error) {
      logger(error);
    }
  }

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

  /**
   * Emits an Action Indicating that Group Data has been updated
   * @param
   */
  groupUpdated(key: string, message: Message, room: Room, options) {
    try {
      if (
        this.room.conversationType === Constants.RECEIVER_TYPE.GROUP &&
        message.receiverType === Constants.RECEIVER_TYPE.GROUP &&
        message.roomId === this.room.id
      ) {
        this.actionGenerated.emit({
          type: enums.GROUP_UPDATED,
          payload: { message, key, room, options },
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Compares two dates and sets Date on a a new day
   */
   areEqual(firstDate: Date, secondDate: Date) {
    try {
      return firstDate?.getDate === secondDate?.getDate &&
        firstDate?.getMonth === secondDate?.getMonth &&
        firstDate?.getFullYear === secondDate?.getFullYear;
    } catch (error) {
      logger(error);
    }
  }
}
