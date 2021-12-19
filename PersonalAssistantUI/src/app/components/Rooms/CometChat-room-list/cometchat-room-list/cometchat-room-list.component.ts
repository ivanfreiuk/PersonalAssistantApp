import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import * as Constants from "../../../../utils/constants";
import { ActionEvent, Room, RoomFilterCriteria, User } from "src/app/models";
import { AuthenticationService, RoomService, SignalRService } from "src/app/services";

@Component({
  selector: "cometchat-room-list",
  templateUrl: "./cometchat-room-list.component.html",
  styleUrls: ["./cometchat-room-list.component.css"],
})
export class CometChatRoomListComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() enableSelectedRoomStyling: boolean = false;
  @Input() roomToUpdate: Room = null;
  @Input() roomToLeave: Room = null;
  @Input() roomToDelete: Room = null;

  timeout;
  loggedInUser: User = null;
  decoratorMessage: string = "";
  searchKey: string = "";
  selectedRoom: Room = null;
  roomList: Room[] = [];
  roomFilterCriteria: RoomFilterCriteria = null;
  groupListenerId = enums.GROUP_LIST_ + new Date().getTime();

  openCreateRoomView: boolean = false;
  GROUPS: String = COMETCHAT_CONSTANTS.GROUPS;
  SEARCH: String = COMETCHAT_CONSTANTS.SEARCH;

  @Output() onRoomClick: EventEmitter<Room> = new EventEmitter<Room>();

  constructor(private ref: ChangeDetectorRef, private signalRService: SignalRService, private roomService: RoomService, private authService: AuthenticationService) {
    setInterval(() => {
      if (!this.ref[enums.DESTROYED]) {
        this.ref.detectChanges();
      }
    }, 5000);
  }

  ngOnChanges(change: SimpleChanges) {
    try {
      if (change[enums.GROUP_TO_UPDATE]) {
        let prevProps = { groupToUpdate: null };
        let props = { groupToUpdate: null };

        prevProps[enums.GROUP_TO_UPDATE] =
          change[enums.GROUP_TO_UPDATE].previousValue;
        props[enums.GROUP_TO_UPDATE] =
          change[enums.GROUP_TO_UPDATE].currentValue;

        if (
          prevProps.groupToUpdate &&
          (prevProps.groupToUpdate.guid !== props.groupToUpdate.guid ||
            (prevProps.groupToUpdate.guid === props.groupToUpdate.guid &&
              (prevProps.groupToUpdate.membersCount !==
                props.groupToUpdate.membersCount ||
                prevProps.groupToUpdate.scope !== props.groupToUpdate.scope)))
        ) {
          const rooms = [...this.roomList];
          const roomToUpdate = this.roomToUpdate;

          const groupKey = rooms.findIndex(
            (group) => group.id === roomToUpdate.id
          );
          if (groupKey > -1) {
            const groupObj = rooms[groupKey];
            const newGroupObj = Object.assign({}, groupObj, roomToUpdate, {
              scope: roomToUpdate[enums.SCOPE],
              membersCount: roomToUpdate[enums.MEMBERS_COUNT],
            });

            rooms.splice(groupKey, 1, newGroupObj);

            this.roomList = rooms;
          }
        }
      }

      if (change[enums.GROUP_TO_LEAVE]) {
        let prevProps = { groupToLeave: null };
        let props = { groupToLeave: null };

        prevProps[enums.GROUP_TO_LEAVE] =
          change[enums.GROUP_TO_LEAVE].previousValue;
        props[enums.GROUP_TO_LEAVE] = change[enums.GROUP_TO_LEAVE].currentValue;

        if (
          prevProps.groupToLeave &&
          prevProps.groupToLeave.guid !== props.groupToLeave.guid
        ) {
          const groups = [...this.roomList];
          const groupKey = groups.findIndex(
            (member) => member.id === props.groupToLeave.guid
          );

          if (groupKey > -1) {
            const groupToLeave = props.groupToLeave;
            const groupObj = { ...groups[groupKey] };
            const membersCount =
              parseInt(groupToLeave[enums.MEMBERS_COUNT]) - 1;

            let newgroupObj = Object.assign({}, groupObj, {
              membersCount: membersCount,
              hasJoined: false,
            });

            groups.splice(groupKey, 1, newgroupObj);

            this.roomList = groups;
          }
        }
      }

      if (change[enums.GROUP_TO_DELETE]) {
        let prevProps = { groupToDelete: null };
        let props = { groupToDelete: null };

        prevProps[enums.GROUP_TO_DELETE] =
          change[enums.GROUP_TO_DELETE].previousValue;
        props[enums.GROUP_TO_DELETE] =
          change[enums.GROUP_TO_DELETE].currentValue;

        if (
          prevProps.groupToDelete &&
          prevProps.groupToDelete.guid !== props.groupToDelete.guid
        ) {
          const groups = [...this.roomList];
          const groupKey = groups.findIndex(
            (member) => member.id === props.groupToDelete.guid
          );
          if (groupKey > -1) {
            groups.splice(groupKey, 1);

            this.roomList = groups;

            if (groups.length === 0) {
              this.decoratorMessage = COMETCHAT_CONSTANTS.NO_GROUPS_FOUND;
            }
          }
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.roomFilterCriteria = this.buildRoomFilterCriteria(this.searchKey);
      this.getNextRooms();
      this.attachListeners(this.groupUpdated);
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    try {
      //Removing Group Listeners
      //CometChat.removeGroupListener(this.groupListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listener for group activities happening in real time
   * @param function callback
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
      //       callback(enums.GROUP_MEMBER_SCOPE_CHANGED, message, changedGroup, {
      //         user: changedUser,
      //         scope: newScope,
      //       });
      //     },
      //     onGroupMemberKicked: (message, kickedUser, kickedBy, kickedFrom) => {
      //       callback(enums.GROUP_MEMBER_KICKED, message, kickedFrom, {
      //         user: kickedUser,
      //         hasJoined: false,
      //       });
      //     },
      //     onGroupMemberBanned: (message, bannedUser, bannedBy, bannedFrom) => {
      //       callback(enums.GROUP_MEMBER_BANNED, message, bannedFrom, {
      //         user: bannedUser,
      //         hasJoined: false,
      //       });
      //     },
      //     onGroupMemberUnbanned: (
      //       message,
      //       unbannedUser,
      //       unbannedBy,
      //       unbannedFrom
      //     ) => {
      //       callback(enums.GROUP_MEMBER_UNBANNED, message, unbannedFrom, {
      //         user: unbannedUser,
      //         hasJoined: false,
      //       });
      //     },
      //     onMemberAddedToGroup: (
      //       message,
      //       userAdded,
      //       userAddedBy,
      //       userAddedIn
      //     ) => {
      //       callback(enums.GROUP_MEMBER_ADDED, message, userAddedIn, {
      //         user: userAdded,
      //         hasJoined: true,
      //       });
      //     },
      //     onGroupMemberLeft: (message, leavingUser, group) => {
      //       callback(enums.GROUP_MEMBER_LEFT, message, group, {
      //         user: leavingUser,
      //       });
      //     },
      //     onGroupMemberJoined: (message, joinedUser, joinedGroup) => {
      //       callback(enums.GROUP_MEMBER_JOINED, message, joinedGroup, {
      //         user: joinedUser,
      //       });
      //     },
      //   })
      // );
    } catch (error) {
      logger(error);
    }
  }

  buildRoomFilterCriteria(searchKeyword: string = null): RoomFilterCriteria {
    return {
      limit: 30,
      pageNumber: 1,
      loggedInUserId: this.authService.currentUserValue.id,
      searchKeyword: searchKeyword,
      conversationType: Constants.RECEIVER_TYPE.GROUP
    };
  }

  /**
   * Fetches list of groups according to the group request config , if a user is loggedIn correctly
   */
  getNextRooms() {
    try {
      this.decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;

      this.roomService.getRooms(this.roomFilterCriteria).toPromise()
        .then((roomList: Room[]) => {
          if (roomList.length === 0) {
            this.decoratorMessage = COMETCHAT_CONSTANTS.NO_GROUPS_FOUND;
          }

          this.roomList = [...this.roomList, ...roomList];

          this.decoratorMessage = "";

          if (this.roomList.length === 0) {
            this.decoratorMessage = COMETCHAT_CONSTANTS.NO_GROUPS_FOUND;
          }

          this.roomFilterCriteria.pageNumber++;
        })
        .catch((error) => {
          this.decoratorMessage = COMETCHAT_CONSTANTS.ERROR;
          logger("Error occured during getting rooms", error);
        });
    } catch (error) {
      logger(error);
    }
  };

  createRoomActionHandler(room: Room) {
    try {
      this.roomList = [room, ...this.roomList];
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Emitting the Room clicked so that it can be used in the parent component
   * @param Room room
   */
  roomClicked(room: Room) {
    try {
      if (!room.hasJoined) { // TODO room.hasJoined === false
        let password = "";
        if (room.roomType === Constants.GROUP_TYPE.PROTECTED) {
          password = prompt(COMETCHAT_CONSTANTS.ENTER_YOUR_PASSWORD);          
        }

        this.joinRoom(room.id, password);
      } else {
        this.onRoomClick.emit(room);
        if (this.enableSelectedRoomStyling) {
          this.selectedRoom = room;
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Helps the current user to join a password protected group , if the password entered by the user is correct
   * @param Event event
   */
  joinRoom(roomId: number, password: string) {
    try {
      const userId = this.authService.currentUserValue.id;
      this.signalRService.joinRoom(roomId, userId, password)
        .then((room: Room) => {
          const rooms = [...this.roomList];

          let roomKey = rooms.findIndex(r => r.id === roomId);
          if (roomKey > -1) {
            rooms.splice(roomKey, 1, room);

            this.roomList = rooms;
            if (this.enableSelectedRoomStyling) {
              this.selectedRoom = room;
            }

            this.onRoomClick.emit(room);
          }
        })
        .catch((error) => {
          logger("Group joining failed with exception:", error);
        });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Searches for a list of groups matching the search key
   * @param Event event
   */
  searchRoom(event) {
    try {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      let searchKey = event.target.value;
      this.timeout = setTimeout(() => {
        this.roomFilterCriteria = this.buildRoomFilterCriteria(searchKey);

        this.roomList = [];
        this.getNextRooms();
      }, 1000);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates group information based on activities in the group
   */
  groupUpdated(key: string, message, room: Room, options) {
    try {
      switch (key) {
        case enums.GROUP_MEMBER_SCOPE_CHANGED:
          this.updateMemberChanged(room, options);
          break;
        case enums.GROUP_MEMBER_KICKED:
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_LEFT:
          this.updateMemberRemoved(room, options);

          break;
        case enums.GROUP_MEMBER_ADDED:
          this.updateMemberAdded(room, options);

          break;
        case enums.GROUP_MEMBER_JOINED:
          this.updateMemberJoined(room, options);
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates the member count of a group when a person is removed from the group
   */
  updateMemberRemoved(room: Room, options) {
    try {
      let roomList = [...this.roomList];

      //search for room
      let roomKey = roomList.findIndex(r => r.id === room.id);

      if (roomKey > -1) {
        if (options && this.loggedInUser.id === options.user.uid) {
          let roomObj = { ...roomList[roomKey] };

          let newRoomObj = Object.assign({}, roomObj, room);

          roomList.splice(roomKey, 1, newRoomObj);

          this.roomList = roomList;
        } else {
          let roomObj = { ...roomList[roomKey] };
          let newgroupObj = Object.assign({}, roomObj, {
            membersCount: room.membersCount,
          });

          roomList.splice(roomKey, 1, newgroupObj);
          this.roomList = roomList;
        }
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates the member count of a group when a person (  or group of people  ) is added to the group
   */
  updateMemberAdded(room: Room, options) {
    try {
      let roomList = [...this.roomList];

      //search for group
      let roomKey = roomList.findIndex((r) => r.id === room.id);

      // if (roomKey > -1) {
      //   let groupObj = { ...roomList[roomKey] };

      //   let membersCount = parseInt(room.membersCount);

      //   let scope = group.hasOwnProperty(enums.SCOPE) ? group.scope : "";
      //   let hasJoined = group.hasOwnProperty(enums.HAS_JOINED)
      //     ? group.hasJoined
      //     : false;

      //   if (options && this.loggedInUser.uid === options.user.uid) {
      //     //scope = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
      //     hasJoined = true;
      //   }

      //   let newgroupObj = Object.assign({}, groupObj, {
      //     membersCount: membersCount,
      //     scope: scope,
      //     hasJoined: hasJoined,
      //   });

      //   groupList.splice(groupKey, 1, newgroupObj);
      //   this.groupList = groupList;
      // } else {
      //   let groupObj = { ...group };

      //   let scope = groupObj.hasOwnProperty(enums.SCOPE) ? groupObj.scope : {};
      //   let hasJoined = groupObj.hasOwnProperty(enums.HAS_JOINED)
      //     ? groupObj.hasJoined
      //     : false;
      //   let membersCount = parseInt(groupObj.membersCount);

      //   if (options && this.loggedInUser.uid === options.user.uid) {
      //     //scope = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
      //     hasJoined = true;
      //   }

      //   let newgroupObj = Object.assign({}, groupObj, {
      //     membersCount: membersCount,
      //     scope: scope,
      //     hasJoined: hasJoined,
      //   });

      //   const groupList = [newgroupObj, ...this.groupList];
      //   this.groupList = groupList;
      // }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates the member count of a group based when a user joins the group
   */
  updateMemberJoined(room: Room, options) {
    try {
      let roomList = [...this.roomList];

      //search for group
      let roomKey = roomList.findIndex((r) => r.id === room.id);

      if (roomKey > -1) {
        let roomObj = { ...roomList[roomKey] };

        // let scope = groupObj.scope;

        // if (options && this.loggedInUser.id === options.user.uid) {
        //   //scope = CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT;
        // }

        // let newgroupObj = Object.assign({}, groupObj, {
        //   membersCount: room.membersCount,
        //   scope: scope,
        // });

        // groupList.splice(groupKey, 1, newgroupObj);
        // this.groupList = groupList;
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Updates the member count of a group based on activities happening in the group
   */
  updateMemberChanged(room: Room, options) {
    try {
      let roomList = [...this.roomList];

      //search for group
      let groupKey = roomList.findIndex(r => r.id === room.id);

      if (groupKey > -1) {
        let groupObj = { ...roomList[groupKey] };
        if (options && this.loggedInUser.id === options.user.id) {
          let newgroupObj = Object.assign({}, groupObj, {
            scope: options.scope,
          });

          roomList.splice(groupKey, 1, newgroupObj);
          this.roomList = roomList;
        }
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action: ActionEvent) {
    try {
      let room = action.payload;

      switch (action.type) {
        case enums.CLOSE_CREATE_GROUP_VIEW: {
          this.toggleCreateRoomView();
          break;
        }
        case enums.GROUP_CREATED: {
          this.toggleCreateRoomView();
          this.createRoomActionHandler(room);
          break;
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Handles scroll action on GroupList and fetches more groups if user scrolls to bottom of group list
   * @param Event action
   */
  handleScroll(event) {
    try {
      const bottom = Math.round(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) ===
        Math.round(event.currentTarget.clientHeight);

      if (bottom) this.getNextRooms();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * toggles between opening and closing of roomCreationView / room creation form
   * @param
   */
  toggleCreateRoomView() {
    try {
      this.openCreateRoomView = !this.openCreateRoomView;
    } catch (error) {
      logger(error);
    }
  }
}
