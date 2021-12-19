import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import * as Constants from "../../../../utils/constants";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import { ActionEvent, Room, RoomMemberFilterCriteria, User, UserFilterCriteria } from "src/app/models";
import { AuthenticationService, RoomService, UserService } from "src/app/services";

@Component({
  selector: "cometchat-room-details",
  templateUrl: "./cometchat-room-details.component.html",
  styleUrls: ["./cometchat-room-details.component.css"],
})
export class CometChatRoomDetailsComponent implements OnInit, OnDestroy {
  @Input() room: Room = null;
  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  guid = null;
  roomMemberFilterCriteria: RoomMemberFilterCriteria;
  bannedGroupMemberRequest = null;


  memberList: User[] = [];
  bannedMemberList: User[] = [];
  administratorsList: User[] = [];
  moderatorsList: User[] = [];
  loggedInUser: User = null;

  openViewMember: boolean = false;
  openBanMember: boolean = false;
  openAddMemberView: boolean = false;

  currentMemberScope: String = "";

  ADMIN: String = Constants.GROUP_MEMBER_SCOPE.ADMIN;
  MODERATOR: String = COMETCHAT_CONSTANTS.MODERATOR;
  PARTICIPANT: String = COMETCHAT_CONSTANTS.PARTICIPANT;
  ADD_MEMBERS: String = COMETCHAT_CONSTANTS.ADD_MEMBERS;
  DELETE_AND_EXIT: String = COMETCHAT_CONSTANTS.DELETE_AND_EXIT;
  LEAVE_GROUP: String = COMETCHAT_CONSTANTS.LEAVE_GROUP;
  BANNED_MEMBERS: String = COMETCHAT_CONSTANTS.BANNED_MEMBERS;
  MEMBERS: String = COMETCHAT_CONSTANTS.MEMBERS;
  OPTIONS: String = COMETCHAT_CONSTANTS.OPTIONS;
  VIEW_MEMBERS: String = COMETCHAT_CONSTANTS.VIEW_MEMBERS;
  DETAILS: String = COMETCHAT_CONSTANTS.DETAILS;

  constructor(private roomService: RoomService, private authService: AuthenticationService) {}

  ngOnInit() {
    try {
      this.loggedInUser = this.authService.currentUserValue;
      this.roomMemberFilterCriteria = this.buildRoomMemberFilterCriteria(this.room.id);
      this.fetchNextRoomMemberList();

      this.bannedGroupMemberRequest = this.createBannedMemberRequest(
        this.room.id
      );
      this.getBannedGroupMembers();

      //this.currentMemberScope = this.checkMemberScope(this.item);

      this.addEventListeners(this.groupUpdated);
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    try {
      this.removeListeners();
    } catch (error) {
      logger(error);
    }
  }

  buildRoomMemberFilterCriteria(roomId: number): RoomMemberFilterCriteria {
    return {
      limit: 30,
      pageNumber: 1,
      roomId: roomId
    };
  }

  fetchNextRoomMemberList() {
    try {
      const administratorsList = [];
      const moderatorsList = [];
      this.roomService.getRoomMembers(this.roomMemberFilterCriteria).toPromise().then(
        (roomMembers: User[]) => {
          roomMembers.forEach((member: User) => {
            if (member.scope === Constants.GROUP_MEMBER_SCOPE.ADMIN) {
              administratorsList.push(member);
            }

            if (member.scope === Constants.GROUP_MEMBER_SCOPE.MODERATOR) {
              moderatorsList.push(member);
            }
          });

          this.memberList = [...this.memberList, ...roomMembers];
          this.administratorsList = [
            ...this.administratorsList,
            ...administratorsList,
          ];
          this.moderatorsList = [...this.moderatorsList, ...moderatorsList];     
        },  
        (error: any) => {
          logger("User list fetching failed with error: ", error);
        }
      );

      this.roomMemberFilterCriteria.pageNumber++;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action: ActionEvent) {
    try {
      let data = action.payload;

      switch (action.type) {
        case enums.OPEN_VIEW_MEMBER: {
          this.toggleViewMember();
          break;
        }
        case enums.CLOSE_ADD_VIEW_MEMBER: {
          this.toggleAddMemberView(false);
          break;
        }
        case enums.UPDATE_GROUP_PARTICIPANTS: {
          this.updateParticipants(data);
          break;
        }
        case enums.ADD_GROUP_PARTICIPANTS: {
          this.addParticipants(data);
          break;
        }
        case enums.REMOVE_GROUP_PARTICIPANTS: {
          this.removeParticipants(data);
          break;
        }
        case enums.BAN_MEMBER: {
          this.toggleBanMember();
          break;
        }
        case enums.UNBAN_GROUP_MEMBERS:
          this.unbanMembers(data);
          break;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listener for activities happening in group in real time
   * @param
   */
  addEventListeners(callback) {
    // try {
    //   CometChat.addGroupListener(
    //     this.groupListenerId,
    //     new CometChat.GroupListener({
    //       onGroupMemberScopeChanged: (
    //         message,
    //         changedUser,
    //         newScope,
    //         oldScope,
    //         changedGroup
    //       ) => {
    //         callback(enums.GROUP_MEMBER_SCOPE_CHANGED, message, changedGroup, {
    //           user: changedUser,
    //           scope: newScope,
    //         });
    //       },
    //       onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
    //         callback(enums.GROUP_MEMBER_KICKED, message, kickedFrom, {
    //           user: kickedUser,
    //           hasJoined: false,
    //         });
    //       },
    //       onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
    //         callback(enums.GROUP_MEMBER_BANNED, message, bannedFrom, {
    //           user: bannedUser,
    //         });
    //       },
    //       onGroupMemberUnbanned: (
    //         message,
    //         unbannedUser,
    //         unbannedBy,
    //         unbannedFrom
    //       ) => {
    //         callback(enums.GROUP_MEMBER_UNBANNED, message, unbannedFrom, {
    //           user: unbannedUser,
    //           hasJoined: false,
    //         });
    //       },
    //       onMemberAddedToGroup: (
    //         message,
    //         userAdded,
    //         userAddedBy,
    //         userAddedIn
    //       ) => {
    //         callback(enums.GROUP_MEMBER_ADDED, message, userAddedIn, {
    //           user: userAdded,
    //           hasJoined: true,
    //         });
    //       },
    //       onGroupMemberLeft: (message, leavingUser, group) => {
    //         callback(enums.GROUP_MEMBER_LEFT, message, group, {
    //           user: leavingUser,
    //         });
    //       },
    //       onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
    //         callback(enums.GROUP_MEMBER_JOINED, message, joinedGroup, {
    //           user: joinedUser,
    //         });
    //       },
    //     })
    //   );

    //   CometChat.addUserListener(
    //     this.userListenerId,
    //     new CometChat.UserListener({
    //       onUserOnline: (onlineUser) => {
    //         /* when someuser/friend comes online, user will be received here */
    //         callback(
    //           enums.USER_ONLINE,
    //           null,
    //           { guid: this.guid },
    //           { user: onlineUser }
    //         );
    //       },
    //       onUserOffline: (offlineUser) => {
    //         /* when someuser/friend went offline, user will be received here */
    //         callback(
    //           enums.USER_OFFLINE,
    //           null,
    //           { guid: this.guid },
    //           { user: offlineUser }
    //         );
    //       },
    //     })
    //   );
    //} catch (error) {
    //  logger(error);
    //}
  }

  /**
   * Removes all the real time group listeners attached to the group that is opened
   * @param
   */
  removeListeners() {
    try {
      //CometChat.removeUserListener(this.userListenerId);
      //CometChat.removeGroupListener(this.groupListenerId);
    } catch (error) {
      logger(error);
    }
  }

  
  /**
   * Creates a Banned MemberList request object
   * @param
   */
  createBannedMemberRequest(guid) {
    try {
      // let bannedGroupMemberRequest = new CometChat.BannedMembersRequestBuilder(
      //   guid
      // )
      //   .setLimit(10)
      //   .build();

      // return bannedGroupMemberRequest;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Fetches list of Banned members accroding to the  banned members request object
   * @param
   */
  getBannedGroupMembers = () => {
    try {
      if (this.loggedInUser.scope === Constants.GROUP_MEMBER_SCOPE.PARTICIPANT) {
        return false;
      }

      // CometChat.getLoggedinUser()
      //   .then((user) => {
      //     this.fetchNextBannedGroupMembers()
      //       .then((bannedMembers) => {
      //         this.bannedMemberList = [
      //           ...this.bannedMemberList,
      //           ...bannedMembers,
      //         ];
      //       })
      //       .catch((error) => {
      //         logger(
      //           "[CometChatGroupDetail] getGroupMembers fetchNextGroupMembers error",
      //           error
      //         );
      //       });
      //   })
      //   .catch((error) => {
      //     logger(
      //       "[CometChatGroupDetail] getGroupMembers getLoggedInUser error",
      //       error
      //     );
      //   });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates group infomation based on activities happening in the group
   */
  groupUpdated = (key: string = null, message = null, room: Room = null, options = null) => {
    try {
      const roomId = this.room.id;
      if (roomId !== room.id) {
        return false;
      }

      switch (key) {
        case enums.USER_ONLINE:
        case enums.USER_OFFLINE:
          this.groupMemberUpdated(options.user);
          break;
        case enums.GROUP_MEMBER_ADDED:
        case enums.GROUP_MEMBER_JOINED:
          {
            const member = options.user;

            const updatedMember = Object.assign({}, member, {
              scope: Constants.GROUP_MEMBER_SCOPE.PARTICIPANT,
            });

            this.addParticipants([updatedMember], false);
          }
          break;
        case enums.GROUP_MEMBER_LEFT:
        case enums.GROUP_MEMBER_KICKED:
          {
            const member = options.user;
            this.removeParticipants(member, false);
          }
          break;
        case enums.GROUP_MEMBER_BANNED:
          {
            const member = options.user;
            this.banMembers([member]);
            this.removeParticipants(member, false);
          }
          break;
        case enums.GROUP_MEMBER_UNBANNED:
          {
            const member = options.user;
            this.unbanMembers([member]);
          }
          break;
        case enums.GROUP_MEMBER_SCOPE_CHANGED:
          {
            const member = options.user;
            const updatedMember = Object.assign({}, member, {
              scope: options[enums.SCOPE],
            });
            this.updateParticipants(updatedMember);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Adds the members that are banned to bannedMemberList
   * @param any members
   */
  banMembers = (members) => {
    try {
      this.bannedMemberList = [...this.bannedMemberList, ...members];
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates group member data and information based on group actions
   * @param any member
   */
  groupMemberUpdated = (member: User) => {
    try {
      let memberList = [...this.memberList];
      //search for user
      let memberKey = memberList.findIndex((m, k) => m.id === member.id);
      //if found in the list, update user object
      if (memberKey > -1) {
        let memberObj = memberList[memberKey];
        let newMemberObj = Object.assign({}, memberObj, member);
        memberList.splice(memberKey, 1, newMemberObj);

        this.memberList = memberList;
      }

      let bannedMemberList = [...this.bannedMemberList];
      //search for user
      let bannedMemberKey = bannedMemberList.findIndex(
        (m, k) => m.id === member.id
      );
      //if found in the list, update user object
      if (bannedMemberKey > -1) {
        let bannedMemberObj = bannedMemberList[bannedMemberKey];
        let newBannedMemberObj = Object.assign({}, bannedMemberObj, member);
        bannedMemberList.splice(bannedMemberKey, 1, newBannedMemberObj);

        this.bannedMemberList = bannedMemberList;
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * fetches next list of Banned members as the user scrolls to the bottom of banned member list
   * @param
   */
  fetchNextBannedGroupMembers() {
    try {
      return this.bannedGroupMemberRequest.fetchNext();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Helps to Add Particpants to the current group
   */
  addParticipants(members: User[], triggerUpdate: boolean = true)  {
    try {
      const memberList = [...this.memberList, ...members];

      this.memberList = memberList;

      this.actionGenerated.emit({
        type: enums.MEMBERS_ADDED,
        payload: members,
      });
      if (triggerUpdate) {
        this.actionGenerated.emit({
          type: enums.MEMBERS_UPDATED,
          payload: { item: this.room, count: memberList.length },
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates Group Participant's data according to the group activities
   */
  updateParticipants(updatedMember: User) {
    try {
      const memberList = [...this.memberList];

      const memberKey = memberList.findIndex(
        (member) => member.id === updatedMember.id
      );
      if (memberKey > -1) {
        const memberObj = memberList[memberKey];
        const newMemberObj = Object.assign({}, memberObj, updatedMember, {
          scope: updatedMember[enums.SCOPE],
        });

        memberList.splice(memberKey, 1, newMemberObj);

        this.actionGenerated.emit({
          type: enums.MEMBER_SCOPE_CHANGED,
          payload: [newMemberObj],
        });

        this.memberList = [...memberList];
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Removes the participant from the group member list , when the member is banned
   */
  removeParticipants(member: User, triggerUpdate: boolean = true) {
    try {
      const groupmembers = [...this.memberList];
      const filteredMembers = groupmembers.filter((groupmember) => groupmember.id !== member.id);
      this.memberList = [...filteredMembers];

      if (triggerUpdate) {
        this.actionGenerated.emit({
          type: enums.MEMBERS_UPDATED,
          payload: {
            item: this.room,
            count: filteredMembers.length,
          },
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Removes the participant from the banned member list , when the member is unbanned
   * @param
   */
  unbanMembers(members: User[]) {
    try {
      const bannedMembers = [...this.bannedMemberList];
      const unbannedMembers = [];

      const filteredBannedMembers = bannedMembers.filter((bannedmember) => {
        const found = members.find((member) => bannedmember.id === member.id);
        if (found) {
          unbannedMembers.push(found);
          return false;
        }
        return true;
      });

      this.actionGenerated.emit({
        type: enums.MEMBER_UNBANNED,
        payload: unbannedMembers,
      });

      this.bannedMemberList = [...filteredBannedMembers];
    } catch (error) {
      logger(error);
    }
  }
  /* helps the user to leave the group
   * @param
   */
  leaveGroup = () => {
    try {
      const guid = this.room.id;
      // CometChat.leaveGroup(guid)
      //   .then((hasLeft) => {
      //     logger("Group left successfully:", hasLeft);
      //     this.actionGenerated.emit({
      //       type: enums.LEFT_GROUP,
      //       payLoad: this.item,
      //     });
      //   })
      //   .catch((error) => {
      //     logger("Group leaving failed with exception:", error);
      //   });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * helps the user (that is admin of the group) to delete the group
   * @param
   */
  deleteGroup = () => {
    try {
      const guid = this.room.id;
      // CometChat.deleteGroup(guid)
      //   .then((response) => {
      //     logger("Groups deleted successfully:", response);
      //     this.actionGenerated.emit({
      //       type: enums.DELETE_GROUP,
      //       payLoad: this.item,
      //     });
      //   })
      //   .catch((error) => {
      //     logger("Group delete failed with exception:", error);
      //   });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Returns the role/scope that the current user has , for the group that is currently opened
   * @param Any member
   */
  checkMemberScope(room: Room) {
    try {
      //group.scope is key which holds the role of the current user in this group

      // if (group.scope == COMETCHAT_CONSTANTS.OWNER) {
      //   return this.ADMIN;
      // }

      // if (group.scope == CometChat.GROUP_MEMBER_SCOPE.ADMIN) {
      //   return this.ADMIN;
      // } else if (group.scope == CometChat.GROUP_MEMBER_SCOPE.MODERATOR) {
      //   return this.MODERATOR;
      // } else {
      //   return this.PARTICIPANT;
      // }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * opens/closes view member modal
   */
  toggleViewMember() {
    try {
      this.openViewMember = !this.openViewMember;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * opens/closes ban member view
   */
  toggleBanMember() {
    try {
      this.openBanMember = !this.openBanMember;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * opens/closes add member view
   */
  toggleAddMemberView(show) {
    try {
      this.openAddMemberView = show;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Close thread when opened in small screen
   */
  closeThreadView() {
    try {
      this.actionGenerated.emit({
        type: enums.CLOSE_DETAIL_CLICKED,
      });
    } catch (error) {
      logger(error);
    }
  }
}
