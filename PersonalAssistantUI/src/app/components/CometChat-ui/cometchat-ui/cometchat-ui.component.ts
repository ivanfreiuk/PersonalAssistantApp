import { Component, OnInit, HostListener } from "@angular/core";
import * as enums from "../../../utils/enums";
import * as Constants from "../../../utils/constants";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { logger } from "../../../utils/common";
import { ActionEvent, Conversation, Room, User } from "src/app/models";
import { AuthenticationService } from "src/app/services";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
@Component({
  selector: "CometChatUI",
  templateUrl: "./cometchat-ui.component.html",
  styleUrls: ["./cometchat-ui.component.css"],
  animations: [
    trigger("FadeInFadeOut", [
      state(
        "normal",
        style({
          left: "0%",
        })
      ),
      state(
        "animated",
        style({
          left: "-100%",
          zIndex: "0",
        })
      ),
      transition("normal<=>animated", animate(300)),
    ]),
  ],
})
export class CometChatUIComponent implements OnInit {
  room: Room = null;
  user: User = null;
  viewDetailScreen: boolean = false;
  lastMessage: Message;
  loggedInUser: User;
  roomToUpdate: Room;
  roomToLeave: Room;
  roomToDelete: Room;
  roomMessage = [];
  composedThreadMessage = null;
  fullScreenViewImage: boolean = false;
  imageView = null;

  checkAnimatedState: string;
  checkIfAnimated: boolean = false;
  innerWidth;

  GROUP: String = Constants.RECEIVER_TYPE.GROUP;
  USER: String = Constants.RECEIVER_TYPE.USER;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    try {
      this.onResize();
      this.loggedInUser = this.authService.currentUserValue;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Checks when window size is changed in realtime
   */
  @HostListener("window:resize", [])
  onResize() {
    try {
      this.innerWidth = window.innerWidth;
      if (
        this.innerWidth >= enums.BREAKPOINT_MIN_WIDTH &&
        this.innerWidth <= enums.BREAKPOINT_MAX_WIDTH
      ) {
        if (this.checkIfAnimated === true) {
          return false;
        }
        this.checkAnimatedState = "normal";
        this.checkIfAnimated = true;
      } else {
        this.checkAnimatedState = null;
        this.checkIfAnimated = false;
      }
    } catch (error) {
      logger(error);
    }
  }

  messageActionHandler(action: ActionEvent) {
    try {
      let message = action.payload;
      switch (action.type) {

        case enums.MESSAGE_COMPOSED:
        case enums.MESSAGE_EDITED:
        case enums.MESSAGE_DELETE:
          this.updateLastMessage(message);
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  }

  actionEventHandler(action: ActionEvent) {
    const payload = action.payload;
    console.log(payload)
    switch (action.type) {
      case enums.VIEW_DETAIL:
      case enums.CLOSE_DETAIL_CLICKED:
        this.toggleDetailView();
        break;
      case enums.VIEW_ACTUAL_IMAGE:
        this.toggleImageView(payload);
        break;
      case enums.CLOSE_FULL_SCREEN_IMAGE: {
        this.toggleImageView(null);
      }
      case enums.MEMBERS_ADDED: {
        this.membersAdded(payload);
        break;
      }
      case enums.MEMBERS_UPDATED: {
        this.updateMembersCount(payload.item, payload.count);
        break;
      }
      case enums.GROUP_UPDATED:
        //this.roomUpdated(data.message, data.key, data.group, data.options);
        break;
      case enums.MEMBER_UNBANNED:
        //this.memberUnbanned(data);
        break;
      case enums.LEFT_GROUP: {
        this.leaveRoom(payload);
        break;
      }
      case enums.DELETE_GROUP: {
        this.deleteRoom(payload);
        break;
      }
      case enums.USER_JOINED_CALL:
      case enums.USER_LEFT_CALL: {
        break;
      }
      case enums.MENU_CLICKED: {
        this.checkAnimatedState = "normal";
        this.room = null;
        break;
      }
      case enums.TAB_CHANGED: {
        this.viewDetailScreen = false;
      }
      default:
        break;
    }
  }
  /**
   * Handles all the actions propagated from the child component
   */
  actionHandler(action: any = null, item = null, count = null) {
    try {
      let message = action.payLoad;
      let data = action.payLoad;

      switch (action.type) {
        case enums.VIEW_DETAIL:
        case enums.CLOSE_DETAIL_CLICKED:
          this.toggleDetailView();
          break;
        case enums.VIEW_ACTUAL_IMAGE:
          this.toggleImageView(message);
          break;
        case enums.CLOSE_FULL_SCREEN_IMAGE: {
          this.toggleImageView(null);
        }
        case enums.MEMBERS_ADDED: {
          this.membersAdded(data);
          break;
        }
        case enums.MEMBERS_UPDATED: {
          this.updateMembersCount(data.item, data.count);
          break;
        }
        case enums.GROUP_UPDATED:
          this.roomUpdated(data.message, data.key, data.group, data.options);
          break;
        case enums.MEMBER_UNBANNED:
          this.memberUnbanned(data);
          break;
        case enums.LEFT_GROUP: {
          this.leaveRoom(data);
          break;
        }
        case enums.DELETE_GROUP: {
          this.deleteRoom(data);
          break;
        }
        case enums.MENU_CLICKED: {
          this.checkAnimatedState = "normal";
          this.room = null;
          break;
        }
        case enums.TAB_CHANGED: {
          this.viewDetailScreen = false;
        }
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * updates lastMessage , so that it can be updated in the conversationList
   */
  updateLastMessage(message: Message) {
    try {
      this.lastMessage = message;
    } catch (error) {
      logger(error);
    }
  }
 
  /**
   * Opens User Detail Right Side bar
   */
  toggleDetailView() {
    try {
      this.viewDetailScreen = !this.viewDetailScreen;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Opens the clicked Image in full screen mode
   */
  toggleImageView(message) {
    try {
      this.imageView = message;
      this.fullScreenViewImage = !this.fullScreenViewImage;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sets the item information with the item that was clicked from conversationList
   */
   conversationClicked(conversation: Conversation) {
    try {
      if (this.checkAnimatedState !== null) {
        this.checkAnimatedState == "normal"
          ? (this.checkAnimatedState = "animated")
          : (this.checkAnimatedState = "normal");
      }
      
      this.room = conversation.room;
      //close detail screen when switching between users/groups
      this.viewDetailScreen = false;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sets the item information with the item that was clicked from userList
   */
  userClicked(user: User) {
    try {
      if (this.checkAnimatedState !== null) {
        this.checkAnimatedState == "normal"
          ? (this.checkAnimatedState = "animated")
          : (this.checkAnimatedState = "normal");
      }

      // TODO select room
      this.user = user;
      //this.room = user;      
      //this.type = Constants.RECEIVER_TYPE.USER;
      //close detail screen when switching between users/groups
      this.viewDetailScreen = false;
    } catch (error) {
      logger(error);
    }
  }
  /**
   * Sets the item information with the item that was clicked from groupList
   */
   roomClicked(room: Room) {
    try {
      if (this.checkAnimatedState !== null) {
        this.checkAnimatedState == "normal"
          ? (this.checkAnimatedState = "animated")
          : (this.checkAnimatedState = "normal");
      }
      this.room = room;
      //close detail screen when switching between users/groups
      this.viewDetailScreen = false;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * updates the messageList with messages about the members that were added
   * @param Any members
   */
  membersAdded(members: User[]) {
    try {
      const messageList = [];
      members.forEach((eachMember) => {
        const message = `${this.loggedInUser.userName} added ${eachMember.userName}`;
        const date: any = new Date();
        const sentAt: any = (date / 1000) | 0;
        const messageObj = {
          category: Constants.CATEGORY_ACTION,
          message: message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt: sentAt,
        };
        messageList.push(messageObj);
      });

      this.roomMessage = messageList;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * updates The count of  number of members present in a group based on group activities , like adding a member or kicking a member
   * @param Any members
   */
  updateMembersCount(room: Room, count: number){
    try {
      console.log(room)
      room.membersCount = count;
     
      this.room = room;
      this.roomToUpdate = room;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates Current Group Information
   * @param
   */
  roomUpdated(message, key, group, options) {
    try {
      switch (key) {
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_KICKED: {
          if (options.user.id === this.loggedInUser.     id) {
            this.room = null;
            this.viewDetailScreen = false;
          }
          break;
        }
        case enums.GROUP_MEMBER_SCOPE_CHANGED: {
          if (options.user.id === this.loggedInUser.id) {
            const newObj = Object.assign({}, this.room, {
              scope: options[enums.SCOPE],
            });

            this.room = newObj;
            this.viewDetailScreen = false;
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   *  Unbans the user , that was previously banned from the group
   * @param
   */
  memberUnbanned(members: User[]) {
    try {
      const messageList = [];
      members.forEach((eachMember) => {
        const message = `${this.loggedInUser.userName} unbanned ${eachMember.userName}`;
        const date: any = new Date();
        const sentAt: any = (date / 1000) | 0;
        const messageObj = {
          category: Constants.CATEGORY_ACTION,
          message: message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt: sentAt,
        };
        messageList.push(messageObj);
      });

      this.roomMessage = messageList;
    } catch (error) {
      logger(error);
    }
  }

  /* Closes group screen and all , after user has left the group
   * @param
   */
  leaveRoom(room: Room) {
    try {
      this.roomToLeave = room;
      this.toggleDetailView();
      this.room = null;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Closes group screen and all , after user has deleted the group
   * @param
   */
  deleteRoom(room: Room) {
    try {
      this.roomToDelete = room;
      this.toggleDetailView();
      this.room = null;
    } catch (error) {
      logger(error);
    }
  }; 
}
