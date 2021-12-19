import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { DatePipe } from "@angular/common";
import { logger } from "../../../../utils/common";
import * as Constants from "../../../../utils/constants";
import { AuthenticationService } from "src/app/services/user/authentication.service";
import { ActionEvent, Room, User } from "src/app/models";
import { SignalRService } from "src/app/services";

@Component({ 
  selector: "cometchat-message-header",
  templateUrl: "./cometchat-message-header.component.html",
  styleUrls: ["./cometchat-message-header.component.css"],
})
export class CometChatMessageHeaderComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() room: Room = null;
  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  userOnlineSubscription: any;
  userOfflineSubscription: any;

  status: string = "";
  isTyping: boolean = false;
  loggedInUser: User = null;
  GROUP: string = Constants.RECEIVER_TYPE.GROUP;
  USER: string = Constants.RECEIVER_TYPE.USER;
  ONLINE: string = Constants.USER_STATUS.ONLINE;
  OFFLINE: string = Constants.USER_STATUS.OFFLINE;
  

  constructor(public datepipe: DatePipe, private authService: AuthenticationService, private signalRService: SignalRService) {}

  ngOnChanges(change: SimpleChanges) {
    try {
      if (change[enums.ROOM]) {

        // if the person you are chatting with changes
        //Removing User Presence , typing and Group Listeners
        this.removeListeners();

        if (this.room.conversationType == Constants.RECEIVER_TYPE.GROUP) {
          let prevProps = {
            room: change[enums.ROOM].previousValue == null
                ? { id: "" }
                : change[enums.ROOM].previousValue,
          };
          let currProps = { room: change[enums.ROOM].currentValue };

          if (
            prevProps.room.id === currProps.room.id &&
            prevProps.room.membersCount !== currProps.room.membersCount
          ) {
            this.updateHeader(enums.GROUP_MEMBER_ADDED, currProps.room);
          }
          if (prevProps.room.id !== currProps.room.id) {
            this.setRoomMemeberCountStatus(this.room.membersCount);
          }
        }

        this.attachListeners();
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.attachListeners();

      this.loggedInUser = this.authService.currentUserValue;

      if (this.room.conversationType == Constants.RECEIVER_TYPE.GROUP) {
        this.setRoomMemeberCountStatus(this.room.membersCount);
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    try {
      //Removing User Presence , typing and Room Listeners
      this.removeListeners();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * attaches Listeners for user activity , group activities and calling
   * @param callback
   */
  attachListeners() {
    try {
      this.userOnlineSubscription =  this.signalRService.userOnlineEvent.subscribe((userId: number) => {
        this.updateHeader(enums.USER_ONLINE);
      });
      this.userOfflineSubscription =  this.signalRService.userOfflineEvent.subscribe((userId: number) => {
        this.updateHeader(enums.USER_OFFLINE);
      });
      // CometChat.addUserListener(
      //   this.userListenerId,
      //   new CometChat.UserListener({
      //     onUserOnline: (onlineUser) => {
      //       /* when someuser/friend comes online, user will be received here */

      //       this.updateHeader(enums.USER_ONLINE, onlineUser);
      //     },
      //     onUserOffline: (offlineUser) => {
      //       /* when someuser/friend went offline, user will be received here */

      //       this.updateHeader(enums.USER_OFFLINE, offlineUser);
      //     },
      //   })
      // );

      // CometChat.addGroupListener(
      //   this.roomListenerId,
      //   new CometChat.GroupListener({
      //     onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
      //       this.updateHeader(
      //         enums.GROUP_MEMBER_KICKED,
      //         kickedFrom,
      //         kickedUser
      //       );
      //     },
      //     onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
      //       this.updateHeader(
      //         enums.GROUP_MEMBER_BANNED,
      //         bannedFrom,
      //         bannedUser
      //       );
      //     },
      //     onMemberAddedToGroup: (
      //       message,
      //       userAdded,
      //       userAddedBy,
      //       userAddedIn
      //     ) => {
      //       this.updateHeader(enums.GROUP_MEMBER_ADDED, userAddedIn);
      //     },
      //     onGroupMemberLeft: (message, leavingUser, group) => {
      //       this.updateHeader(enums.GROUP_MEMBER_LEFT, group, leavingUser);
      //     },
      //     onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
      //       this.updateHeader(enums.GROUP_MEMBER_JOINED, joinedGroup);
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
  removeListeners() {
    try {
      // CometChat.removeUserListener(this.userListenerId);
      // CometChat.removeMessageListener(this.msgListenerId);
      // CometChat.removeGroupListener(this.roomListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates header such as typing indicator, count of group members, user status
   * @param
   */
  updateHeader(key: string = null, room: Room = null, user: User = null) {
    try {
      console.log("updateHeader")
      switch (key) {
        case enums.USER_ONLINE:
        case enums.USER_OFFLINE: {
          if (
            this.room.conversationType === Constants.RECEIVER_TYPE.USER &&
            this.room.id === room.id
          ) {
            this.room = { ...room };
          }
          break;
        }
        case enums.GROUP_MEMBER_KICKED:
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_LEFT:
          if (
            this.room.conversationType === Constants.RECEIVER_TYPE.GROUP &&
            this.room.id === room.id &&
            this.loggedInUser.id !== user.id
          ) {
            this.room.membersCount = room.membersCount;
            this.setRoomMemeberCountStatus(room.membersCount);
          }
          break;
        case enums.GROUP_MEMBER_JOINED:
          case enums.GROUP_MEMBER_ADDED:
          if ( this.room.conversationType === Constants.RECEIVER_TYPE.GROUP && this.room.id === room.id ) {
            this.room.membersCount = room.membersCount
            this.setRoomMemeberCountStatus(room.membersCount);
          }
          break;
        // case enums.TYPING_STARTED: {
        //   if (
        //     this.type === Constants.RECEIVER_TYPE.GROUP &&
        //     this.type === item.receiverType &&
        //     this.item.id === item.receiverId
        //   ) {
        //     this.status = item.sender.name + COMETCHAT_CONSTANTS.IS_TYPING;
        //     this.actionGenerated.emit({
        //       type: enums.SHOW_REACTION,
        //       payLoad: item,
        //     });
        //   } else if (
        //     this.type === Constants.RECEIVER_TYPE.USER &&
        //     this.type === item.receiverType &&
        //     this.item.id === item.sender.uid
        //   ) {
        //     this.isTyping = true;
        //     this.status = COMETCHAT_CONSTANTS.TYPING;
        //     this.actionGenerated.emit({
        //       type: enums.SHOW_REACTION,
        //       payLoad: item,
        //     });
        //   }
        //   break;
        // }
        // case enums.TYPING_ENDED: {
        //   if (
        //     this.type === Constants.RECEIVER_TYPE.GROUP &&
        //     this.type === item.receiverType &&
        //     this.item.id === item.receiverId
        //   ) {
        //     this.setRoomMemeberCountStatus((<Group>this.item).membersCount);

        //     // this.setStatusForGroup();
        //     this.actionGenerated.emit({
        //       type: enums.STOP_REACTION,
        //       payLoad: item,
        //     });
        //   } else if (
        //     this.type === Constants.RECEIVER_TYPE.USER &&
        //     this.type === item.receiverType &&
        //     this.item.id === item.sender.uid
        //   ) {
        //     if ((<User>this.item).status === Constants.USER_STATUS.ONLINE) {
        //       this.status = null;
        //       this.isTyping = false;
        //     } else {
        //       this.getLastActiveDate(item.lastActiveAt);
        //     }
        //     this.actionGenerated.emit({
        //       type: enums.STOP_REACTION,
        //       payLoad: item,
        //     });
        //   }
        //   break;
        // }
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sets status of the group according to its member count
   * @param number membersCount
   */
  setRoomMemeberCountStatus(membersCount: number) {
    this.status = `${COMETCHAT_CONSTANTS.MEMBERS_COUNT} ${membersCount}`
  }

  /**
   * Get Last Active Date
   * @param
   */
  getLastActiveDate(date: Date) {
    try {
      let lastActiveDate = COMETCHAT_CONSTANTS.LAST_ACTIVE_AT;

      if (date === undefined) {
        lastActiveDate = Constants.USER_STATUS.OFFLINE;
        return lastActiveDate;
      }

      lastActiveDate = lastActiveDate + this.datepipe.transform(date, "dd MMMM yyyy, h:mm a");

      return lastActiveDate;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Emits an action to indicate the parent component to open the user ( you are chatting with ) Detail component
   * @param
   */
  openUserDetail() {
    try {
      this.actionGenerated.emit({ 
        type: enums.VIEW_DETAIL, 
        payload: null });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Closes Chat Window
   */
  closeChatWindow() {
    try {
      this.actionGenerated.emit({ type: enums.MENU_CLICKED });
    } catch (error) {
      logger(error);
    }
  }

  // TODO Add valid status
  getRoomStatus(room: Room): string {
    return COMETCHAT_CONSTANTS.ONLINE;
  }
}
