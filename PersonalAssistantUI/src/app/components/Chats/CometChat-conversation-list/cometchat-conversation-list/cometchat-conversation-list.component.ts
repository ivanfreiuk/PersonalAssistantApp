import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewRef,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { INCOMING_OTHER_MESSAGE_SOUND } from "../../../../resources/audio/incomingOtherMessageSound";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import * as Constants from "../../../../utils/constants";
import { logger } from "../../../../utils/common";
import { AuthenticationService } from "src/app/services/user/authentication.service";
import { Conversation, ConversationFilterCriteria, Message, Room, User } from "src/app/models";
import { ConversationService } from "src/app/services/chat/conversation.service";
import { SignalRService } from "src/app/services";

@Component({
  selector: "cometchat-conversation-list",
  templateUrl: "./cometchat-conversation-list.component.html",
  styleUrls: ["./cometchat-conversation-list.component.css"],
})
export class CometChatConversationListComponent implements OnInit, OnChanges {
  @Input() room: Room = null;
  @Input() loggedInUser: User = null;
  @Input() lastMessage: Message;
  @Output() onConversationClick: EventEmitter<Conversation> = new EventEmitter<Conversation>();
  @Input() roomToUpdate: Room = null;
  @Input() roomToLeave: Room = null;
  @Input() roomToDelete: Room = null;

  userOnlineSubscription: any;
  userOfflineSubscription: any;

  decoratorMessage: string = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
  
  conversationList: Conversation[] = [];
  selectedConversation: any = undefined;
  checkItemChange: boolean = false;

  conversationFilterCriteria: ConversationFilterCriteria = null;


  CHATS: string = COMETCHAT_CONSTANTS.CHATS;

  constructor(private ref: ChangeDetectorRef, 
    private authService: AuthenticationService, 
    private conversationService: ConversationService,
    private signalRService: SignalRService) {
    this.loggedInUser = this.authService.currentUserValue;
    setInterval(() => {
      if (!(this.ref as ViewRef).destroyed) {
        this.ref.detectChanges();
      }
    }, 1500);
  }
 
  ngOnChanges(change: SimpleChanges) {
    try {
      if (change[enums.ROOM]) {
        this.checkItemChange = true;
        if (
          change[enums.ROOM].previousValue !==
          change[enums.ROOM].currentValue &&
          change[enums.ROOM].currentValue
        ) {
          if (Object.keys(change[enums.ROOM].currentValue).length === 0) {
            this.selectedConversation = {};
          } else {
            const conversationlist = [...this.conversationList];

            const conversationObj = conversationlist.find((c) => {
              if ( c.roomId === this.room.id) {
                return c;
              }
              return false;
            });
            if (conversationObj) {
              let conversationKey = conversationlist.indexOf(conversationObj);
              let newConversationObj = {
                ...conversationObj,
                unreadMessageCount: 0,
              };
              //conversationlist.splice(conversationKey, 1, newConversationObj);
              this.conversationList = conversationlist;
              this.selectedConversation = newConversationObj;
            }
          }

          // if user is blocked/unblocked, update conversationlist i.e user is removed from conversationList
          if (
            change[enums.ITEM].previousValue &&
            Object.keys(change[enums.ITEM].previousValue).length &&
            change[enums.ITEM].previousValue.id ===
            change[enums.ITEM].currentValue.id &&
            change[enums.ITEM].previousValue.blockedByMe !==
            change[enums.ITEM].currentValue.blockedByMe
          ) {
            let conversationlist = [...this.conversationList];

            //search for user
            let convKey = conversationlist.findIndex(
              (c, k) =>
                c.conversationType === Constants.RECEIVER_TYPE.USER &&
                c.roomId === change[enums.ITEM].currentValue.id
            );
            if (convKey > -1) {
              conversationlist.splice(convKey, 1);
              this.conversationList = conversationlist;
            }
          }
        }
      }

      // if (change[enums.GROUP_TO_UPDATE]) {
      //   let prevProps = { groupToUpdate: null };
      //   let props = { groupToUpdate: null };

      //   prevProps[enums.GROUP_TO_UPDATE] =
      //     change[enums.GROUP_TO_UPDATE].previousValue;
      //   props[enums.GROUP_TO_UPDATE] =
      //     change[enums.GROUP_TO_UPDATE].currentValue;

      //   if (
      //     prevProps.groupToUpdate &&
      //     (prevProps.groupToUpdate.guid !== props.groupToUpdate.guid ||
      //       (prevProps.groupToUpdate.guid === props.groupToUpdate.guid &&
      //         (prevProps.groupToUpdate.membersCount !==
      //           props.groupToUpdate.membersCount ||
      //           prevProps.groupToUpdate.scope !== props.groupToUpdate.scope)))
      //   ) {
      //     const conversationList = [...this.conversationList];
      //     const groupToUpdate = this.groupToUpdate;

      //     const groupKey = conversationList.findIndex(
      //       (group) => group.withGroupId === groupToUpdate.id
      //     );
      //     if (groupKey > -1) {
      //       const groupObj = conversationList[groupKey];
      //       const newGroupObj = Object.assign({}, groupObj, groupToUpdate, {
      //         scope: groupToUpdate[enums.SCOPE],
      //         membersCount: groupToUpdate[enums.MEMBERS_COUNT],
      //       });

      //       conversationList.splice(groupKey, 1, newGroupObj);

      //       this.conversationList = conversationList;
      //     }
      //   }
      // }

      // if (change[enums.GROUP_TO_LEAVE]) {
      //   let prevProps = { groupToLeave: null };
      //   let props = { groupToLeave: null };

      //   prevProps[enums.GROUP_TO_LEAVE] =
      //     change[enums.GROUP_TO_LEAVE].previousValue;
      //   props[enums.GROUP_TO_LEAVE] = change[enums.GROUP_TO_LEAVE].currentValue;

      //   if (
      //     prevProps.groupToLeave &&
      //     prevProps.groupToLeave.guid !== props.groupToLeave.guid
      //   ) {
      //     const conversationList = [...this.conversationList];
      //     const groupKey = conversationList.findIndex(
      //       (group) => group.withGroupId === props.groupToLeave.id
      //     );

      //     if (groupKey > -1) {
      //       const groupToLeave = props.groupToLeave;
      //       const groupObj = { ...conversationList[groupKey] };
      //       const membersCount =
      //         parseInt(groupToLeave[enums.MEMBERS_COUNT]) - 1;

      //       let newgroupObj = Object.assign({}, groupObj, {
      //         membersCount: membersCount,
      //         hasJoined: false,
      //       });

      //       conversationList.splice(groupKey, 1, newgroupObj);

      //       this.conversationList = conversationList;
      //     }
      //   }
      // }

      // if (change[enums.GROUP_TO_DELETE]) {
      //   let prevProps = { groupToDelete: null };
      //   let props = { groupToDelete: null };

      //   prevProps[enums.GROUP_TO_DELETE] =
      //     change[enums.GROUP_TO_DELETE].previousValue;
      //   props[enums.GROUP_TO_DELETE] =
      //     change[enums.GROUP_TO_DELETE].currentValue;

      //   if (
      //     prevProps.groupToDelete &&
      //     prevProps.groupToDelete.guid !== props.groupToDelete.guid
      //   ) {
      //     const conversationList = [...this.conversationList];
      //     const groupKey = conversationList.findIndex(
      //       (group) => group.withGroupId === props.groupToDelete.guid
      //     );

      //     if (groupKey > -1) {
      //       conversationList.splice(groupKey, 1);

      //       this.conversationList = conversationList;

      //       if (conversationList.length === 0) {
      //         this.decoratorMessage = COMETCHAT_CONSTANTS.NO_CHATS_FOUND;
      //       }
      //     }
      //   }
      // }

      // /**
      //  * When user sends message conversationList is updated with latest message
      //  */
      if (this.checkItemChange === false) {
        if (change[enums.LAST_MESSAGE]) {
          if (
            change[enums.LAST_MESSAGE].previousValue !==
            change[enums.LAST_MESSAGE].currentValue &&
            change[enums.LAST_MESSAGE].currentValue !== undefined
          ) {
            const lastMessage: Message = change[enums.LAST_MESSAGE].currentValue;

            const conversationList = [...this.conversationList];
            const conversationIndex = conversationList.findIndex((c) => {
              if (lastMessage === undefined) {
                return false;
              }
              return c.roomId === lastMessage.roomId;
            });

            if (conversationIndex > -1) {
              const conversationObj = conversationList[conversationIndex];
              let newConversationObj = {
                ...conversationObj,
                lastMessage: lastMessage,
              };

              conversationList.splice(conversationIndex, 1);
              conversationList.unshift(newConversationObj);
              this.conversationList = conversationList;
            }
          }
        }
      }
      this.checkItemChange = false;
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.conversationFilterCriteria = this.buildConversationFilterCriteria();
      this.getConversation();
      this.attachConverationListeners();
      this.attachListeners(this.conversationUpdated);
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    this.removeConversationListeners();
  }

  attachConverationListeners(){
    this.userOnlineSubscription = this.signalRService.userOnlineEvent.subscribe((userId: number) => {
      this.onUserStatusChanged(userId);
    });
    this.userOfflineSubscription = this.signalRService.userOfflineEvent.subscribe((userId: number) => {
      this.onUserStatusChanged(userId);
    });
  }
  
   // Updates Detail when user comes online/offline
   private onUserStatusChanged(userId: number) {
    try {
      // when user updates
      //Gets the index of user which comes offline/online
      const conversationIndex = this.conversationList.findIndex(
        (conversation) =>
        conversation.conversationType === Constants.RECEIVER_TYPE.USER
        //&& conversation.withUserId === userId
      );
      if (conversationIndex > -1) {
        // TODO Update user status.
        this.conversationList[conversationIndex];
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * attaches Listeners for user activity , group activities and calling
   * @param callback
   */
  attachListeners(callback) {
    try {

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
      //       callback(enums.GROUP_MEMBER_SCOPE_CHANGED, changedGroup, message, {
      //         user: changedUser,
      //         scope: newScope,
      //       });
      //     },
      //     onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
      //       callback(enums.GROUP_MEMBER_KICKED, kickedFrom, message, {
      //         user: kickedUser,
      //         hasJoined: false,
      //       });
      //     },
      //     onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
      //       callback(enums.GROUP_MEMBER_BANNED, bannedFrom, message, {
      //         user: bannedUser,
      //       });
      //     },
      //     onGroupMemberUnbanned: (
      //       message,
      //       unbannedUser,
      //       unbannedBy,
      //       unbannedFrom
      //     ) => {
      //       callback(enums.GROUP_MEMBER_UNBANNED, unbannedFrom, message, {
      //         user: unbannedUser,
      //       });
      //     },
      //     onMemberAddedToGroup: (
      //       message,
      //       userAdded,
      //       userAddedBy,
      //       userAddedIn
      //     ) => {
      //       callback(enums.GROUP_MEMBER_ADDED, userAddedIn, message, {
      //         user: userAdded,
      //         hasJoined: true,
      //       });
      //     },
      //     onGroupMemberLeft: (message, leavingUser, group) => {
      //       callback(enums.GROUP_MEMBER_LEFT, group, message, {
      //         user: leavingUser,
      //       });
      //     },
      //     onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
      //       callback(enums.GROUP_MEMBER_JOINED, joinedGroup, message, {
      //         user: joinedUser,
      //       });
      //     },
      //   })
      // );

      // CometChat.addMessageListener(
      //   this.conversationListenerId,
      //   new CometChat.MessageListener({
      //     onTextMessageReceived: (textMessage) => {
      //       callback(enums.TEXT_MESSAGE_RECEIVED, null, textMessage);
      //     },
      //     onMediaMessageReceived: (mediaMessage) => {
      //       callback(enums.MEDIA_MESSAGE_RECEIVED, null, mediaMessage);
      //     },
      //     onCustomMessageReceived: (customMessage) => {
      //       callback(enums.CUSTOM_MESSAGE_RECEIVED, null, customMessage);
      //     },
      //     onMessageDeleted: (deletedMessage) => {
      //       callback(enums.MESSAGE_DELETED, null, deletedMessage);
      //     },
      //     onMessageEdited: (editedMessage) => {
      //       callback(enums.MESSAGE_EDITED, null, editedMessage);
      //     },
      //   })
      // );

    } catch (error) {
      logger(error);
    }
  }
  /**
   * Removes all listeners
   */
  removeConversationListeners() {
    try {
      this.userOnlineSubscription.unsubscribe()
      this.userOfflineSubscription.unsubscribe();
      // CometChat.removeGroupListener(this.groupListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Fetches Conversations Details with all the users
   */
  getConversation() {
    try {
      this.conversationService.getConversations(this.conversationFilterCriteria).toPromise()
        .then((conversationList: Conversation[]) => {
          conversationList.forEach((conversation: Conversation) => { 
            if (
              this.room !== null &&
              this.room.conversationType === conversation.conversationType &&
              this.room.id === conversation.roomId
            ) {
              conversation.unreadMessageCount = 0;
            }
          });
          this.conversationList = [
            ...this.conversationList,
            ...conversationList,
          ];

          this.decoratorMessage = this.conversationList.length === 0 ? COMETCHAT_CONSTANTS.NO_CHATS_FOUND : "";
        })
        .catch((error) => {
          this.decoratorMessage = COMETCHAT_CONSTANTS.ERROR;
          logger("Error occured during getting conversations", error );
        });
    } catch (error) {
      logger(error);
    }
  }

  buildConversationFilterCriteria(): ConversationFilterCriteria {
    return {
      limit: 50,
      pageNumber: 1,
      loggedInUserId: this.authService.currentUserValue.id
    }
  }

  /**
   * Updates the conversation list's last message , badgeCount , user presence based on activities propagated by listeners
   */
  conversationUpdated(key: string = null, item = null, message = null, options = null ) {
    try {
      switch (key) {
        case enums.TEXT_MESSAGE_RECEIVED:
        case enums.MEDIA_MESSAGE_RECEIVED:
        case enums.CUSTOM_MESSAGE_RECEIVED:
          this.updateConversation(message);
          break;
        //case enums.MESSAGE_EDITED:
        case enums.MESSAGE_DELETED:
          this.conversationEditedDeleted(message);
          break;
      }
    } catch (error) {
      logger(error);
    }
  };

  

  /**
   *
   * Gets the last message
   * @param conversation
   */
  makeLastMessage(message, conversation = {}) {
    try {
      const newMessage = Object.assign({}, message);
      return newMessage;
    } catch (error) {
      logger(error);
    }
  }

  /**
   *
   * Updates Conversations as Text/Custom Messages are received
   * @param
   *
   */
  updateConversation(message: Message, notification: boolean = true) {
    //try {
    //   this.getConversationByMessage(message)
    //     .then((response: any) => {
    //       const conversationKey = response.conversationKey;
    //       const conversationObj = response.conversationObj;
    //       const conversationList = response.conversationList;

    //       if (conversationKey > -1) {
    //         let unreadMessageCount = this.makeUnreadMessageCount(
    //           conversationObj
    //         );
    //         let lastMessageObj = this.makeLastMessage(message, conversationObj);
    //         let newConversationObj = {
    //           ...conversationObj,
    //           lastMessage: lastMessageObj,
    //           unreadMessageCount: unreadMessageCount,
    //         };

    //         conversationList.splice(conversationKey, 1);
    //         conversationList.unshift(newConversationObj);
    //         this.conversationList = conversationList;

    //         if (notification) {
    //           this.playAudio();
    //         }
    //       } else {
    //         let unreadMessageCount = this.makeUnreadMessageCount();
    //         let lastMessageObj = this.makeLastMessage(message);
    //         let newConversationObj = {
    //           ...conversationObj,
    //           lastMessage: lastMessageObj,
    //           unreadMessageCount: unreadMessageCount,
    //         };
    //         conversationList.unshift(newConversationObj);
    //         this.conversationList = conversationList;

    //         if (notification) {
    //           this.playAudio();
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       logger(
    //         "This is an error in converting message to conversation",
    //         error
    //       );
    //     });
    // } catch (error) {
    //   logger(error);
    // }
  }
    
  /**
   * Changes detail of conversations
   * @param
   */
  getConversationByMessage(message: Message) {
    let conversationList: Conversation[] = [...this.conversationList];
    let conversationIndex = conversationList.findIndex(
      (conversation: Conversation) => conversation.roomId === message.roomId
    );

    let conversation: Conversation;
    if (conversationIndex > -1) {
      //conversation = { ...conversationList[conversationIndex] };
    }

    return {
      conversationIndex: conversationIndex,
      conversation: conversation,
      conversationList: conversationList,
    };
  }

  /**
   * Updates Conversation View when message is edited or deleted
   */
  conversationEditedDeleted(message: Message) {
    const conversationDetails = this.getConversationByMessage(message);        
    const conversationIndex = conversationDetails.conversationIndex;
    const conversation = conversationDetails.conversation;
    const conversationList = conversationDetails.conversationList;
    if (conversationIndex > -1) {
      let lastMessage = conversation.lastMessage;

      if (lastMessage.id === message.id) {
        const newLastMessage = Object.assign(
          {},
          lastMessage,
          message
        );
        let newConversation = Object.assign({}, conversation, {
          lastMessage: newLastMessage,
        });
        conversationList.splice(conversationIndex, 1, newConversation);
        this.conversationList = conversationList;
      }
    }        
  }

  /**
   * If User scrolls to the bottom of the current Conversation list than fetch next items of the Conversation list and append
   * @param Event e
   */
  handleScroll(event) {
    try {
      const bottom = Math.round(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) ===
        Math.round(event.currentTarget.clientHeight);
      if (bottom) {
        this.decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
        this.getConversation();
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Emits Conversation on Conversation Click
   * @param conversation
   */
  onConversationClicked(conversation: Conversation) {
    try {
      this.onConversationClick.emit(conversation);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Plays Audio When Message is Received
   */
  playAudio() {
    try {
      let audio = new Audio();
      audio.src = INCOMING_OTHER_MESSAGE_SOUND;
      audio.play();
    } catch (error) {
      logger(error);
    }
  }
}
