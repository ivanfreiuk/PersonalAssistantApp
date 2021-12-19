import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import * as enums from "../../../../utils/enums";
import * as Constants from "../../../../utils/constants";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import { Message, Room, User } from "src/app/models";
import { AuthenticationService } from "src/app/services";

@Component({
  selector: "cometchat-shared-media",
  templateUrl: "./cometchat-shared-media.component.html",
  styleUrls: ["./cometchat-shared-media.component.css"],
})
export class CometChatSharedMediaComponent implements OnInit {
  @ViewChild("mediaContainer", { static: false }) mediaWindow: ElementRef;

  @Input() room: Room = null;
  messageType: string = Constants.MESSAGE_TYPE.IMAGE; //Sets type of media message to be fetched
  messageList = [];

  displaySharedMedia: any;
  mediaMessageRequest = null;
  loggedInUser: User;

  //If No speciifc type of media message is sent/received
  checkMediaMessage: boolean = false;
  displayMessage: string;

  scrollVariable = 0;
  scrolltoBottom: boolean;

  imageClick: boolean = true;
  videoClick: boolean = false;
  docsClick: boolean = false;

  SHARED_MEDIA: String = COMETCHAT_CONSTANTS.SHARED_MEDIA;
  PHOTOS: String = COMETCHAT_CONSTANTS.PHOTOS;
  VIDEOS: String = COMETCHAT_CONSTANTS.VIDEOS;
  DOCUMENT: String = COMETCHAT_CONSTANTS.DOCUMENT;
  MESSAGE_TYPE_IMAGE: String = Constants.MESSAGE_TYPE.IMAGE;
  MESSAGE_TYPE_VIDEO: String = Constants.MESSAGE_TYPE.VIDEO;
  MESSAGE_TYPE_FILE: String = Constants.MESSAGE_TYPE.FILE;

  constructor(private authService: AuthenticationService) {
    this.loggedInUser = authService.currentUserValue;
  }

  ngOnInit() {
    try {
      // this.displaySharedMedia = this.mediaMessageRequestBuilder(
      //   this.item,
      //   this.type,
      //   this.messageType
      // );
      this.getMessages(true);
      this.addMediaMessageEventListeners(this.messageUpdated);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Removing Listeners
   */
  ngOnDestroy() {
    try {
      //CometChat.removeMessageListener(this.mediaMessageListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Builds the user request
   */
  mediaMessageRequestBuilder(item, type, messageType) {
    try {
      if (type === Constants.RECEIVER_TYPE.USER) {
        // this.mediaMessageRequest = new CometChat.MessagesRequestBuilder()
        //   .setUID(item.uid)
        //   .setLimit(10)
        //   .setCategory(Constants.CATEGORY_MESSAGE)
        //   .setType(messageType)
        //   .build();
      } else {
        // this.mediaMessageRequest = new CometChat.MessagesRequestBuilder()
        //   .setGUID(item.guid)
        //   .setLimit(10)
        //   .setCategory(CometChat.CATEGORY_MESSAGE)
        //   .setType(messageType)
        //   .build();
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listener To Receive Media Messages in Real Time
   *  @param
   */
  addMediaMessageEventListeners(callback) {
    try {
      // CometChat.addMessageListener(
      //   this.mediaMessageListenerId,
      //   new CometChat.MessageListener({
      //     onMediaMessageReceived: (mediaMessage) => {
      //       callback(enums.MEDIA_MESSAGE_RECEIVED, mediaMessage);
      //     },
      //     onMessageDeleted: (deletedMessage) => {
      //       callback(enums.MESSAGE_DELETED, deletedMessage);
      //     },
      //   })
      // );
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates sharedMediaView on basis of user activity or group activity
   */
  messageUpdated(key: string, message: Message) {
    try {
      switch (key) {
        case enums.MESSAGE_DELETED:
          this.messageDeleted(message);
          break;
        case enums.MEDIA_MESSAGE_RECEIVED:
          this.messageReceived(message);
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * If User Deletes Message
   * @param
   */
  messageDeleted(deletedMessage) {
    try {
      // const messageType = deletedMessage.data.type;
      // if (
      //   this.type === Constants.RECEIVER_TYPE.GROUP &&
      //   deletedMessage.getReceiverType() === Constants.RECEIVER_TYPE.GROUP &&
      //   deletedMessage.getReceiver().guid === this.item.guid &&
      //   messageType === this.messageType
      // ) {
      //   const messageList = [...this.messageList];
      //   const filteredMessages = messageList.filter(
      //     (message) => message.id !== deletedMessage.id
      //   );
      //   this.messageList = filteredMessages;
      //   this.scrolltoBottom = false;
      // }
    } catch (error) {
      logger(error);
    }
  }
  /**
   * When a message is recieved
   * @param
   */
  messageReceived(message) {
    try {
      // const messageType = message.data.type;
      // if (
      //   this.type === Constants.RECEIVER_TYPE.GROUP &&
      //   message.getReceiverType() === Constants.RECEIVER_TYPE.GROUP &&
      //   message.getReceiver().guid === this.item.guid &&
      //   messageType === this.messageType
      // ) {
      //   let messages = [...this.messageList];
      //   messages = messages.concat(message);
      //   this.messageList = messages;
      //   this.scrolltoBottom = true;
      // }
    } catch (error) {
      logger(error);
    }
  }

  /**
   *   Gets the Media Message that are displayed
   * @param
   */
  getMessages(scrollToBottom = false) {
    // try {
    //   Constants.getLoggedinUser()
    //     .then((user) => {
    //       this.loggedInUser = user;

    //       this.fetchPreviousMessages()
    //         .then((messages) => {
    //           const messageList = [...messages, ...this.messageList];

    //           if (messageList.length === 0) {
    //             this.checkMediaMessage = true;
    //             this.displayMessage = COMETCHAT_CONSTANTS.NO_RECORDS_FOUND;
    //           }
    //           if (scrollToBottom) {
    //             this.messageList = messageList;
    //             this.scrollToBottom();
    //           } else {
    //             //No Need for below actions if there is nothing to prepend
    //             if (messages.length !== 0) {
    //               let prevScrollHeight = this.mediaWindow.nativeElement
    //                 .scrollHeight;

    //               this.messageList = messageList;

    //               setTimeout(() => {
    //                 this.scrollVariable =
    //                   this.mediaWindow.nativeElement.scrollTop +
    //                   this.mediaWindow.nativeElement.scrollHeight -
    //                   prevScrollHeight;
    //               });
    //             }
    //           }
    //         })
    //         .catch((error) => {
    //           //TODO Handle the erros in contact list.
    //           logger(
    //             "[SharedMediaView] getMessages fetchPrevious error",
    //             error
    //           );
    //         });
    //     })
    //     .catch((error) => {
    //       logger("[SharedMediaView] getMessages getLoggedInUser error", error);
    //     });
    // } catch (error) {
    //   logger(error);
    // }
  }

  /**
   * Fetches All the previous Messages
   */
  fetchPreviousMessages() {
    try {
      return this.mediaMessageRequest.fetchPrevious();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Scrolls to Bottom of Chat Window
   */
  scrollToBottom() {
    try {
      setTimeout(() => {
        this.scrollVariable =
          this.mediaWindow.nativeElement.scrollHeight -
          this.mediaWindow.nativeElement.clientHeight;
      });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Handles the scroll
   * @param
   */
  handleScroll(e) {
    try {
      const top = Math.round(e.currentTarget.scrollTop) === 0;
      if (top && this.messageList.length) {
        this.getMessages();
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sets the type of message i.e image,video or file
   * @param
   */
  mediaClickHandler(type) {
    try {
      if (type === Constants.MESSAGE_TYPE.IMAGE) {
        this.imageClick = true;
        this.videoClick = false;
        this.docsClick = false;
      } else if (type === Constants.MESSAGE_TYPE.VIDEO) {
        this.imageClick = false;
        this.videoClick = true;
        this.docsClick = false;
      } else if (type === Constants.MESSAGE_TYPE.FILE) {
        this.imageClick = false;
        this.videoClick = false;
        this.docsClick = true;
      }

      this.checkMediaMessage = false;
      this.messageList = [];
      this.messageType = type;
      // this.displaySharedMedia = this.mediaMessageRequestBuilder(
      //   this.item,
      //   this.type,
      //   this.messageType
      // );
      this.getMessages(true);
    } catch (error) {
      logger(error);
    }
  }
}
