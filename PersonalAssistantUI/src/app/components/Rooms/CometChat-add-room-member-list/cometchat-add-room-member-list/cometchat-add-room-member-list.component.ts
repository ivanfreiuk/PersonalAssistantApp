import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import * as Constants from "../../../../utils/constants";
import { logger } from "../../../../utils/common";
import { ActionEvent, Room, User, UserFilterCriteria } from "src/app/models";
import { AuthenticationService, SignalRService, UserService } from "src/app/services";

@Component({
  selector: "cometchat-add-room-member-list",
  templateUrl: "./cometchat-add-room-member-list.component.html",
  styleUrls: ["./cometchat-add-room-member-list.component.css"],
})
export class CometChatAddRoomMemberListComponent implements OnInit, OnDestroy {
  @Input() room: Room = null;
  @Input() memberList: User[] = [];
  @Input() bannedMemberList = [];
  @Input() friendsOnly: boolean = false;

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
  userlist: User[] = [];
  membersToAdd: User[] = [];
  membersToRemove: User[] = [];
  filteredList: User[] = [];
  timeout: any;
  addBtnText: String = COMETCHAT_CONSTANTS.ADD;

  userFilterCriteria: UserFilterCriteria = null;

  USERS: String = COMETCHAT_CONSTANTS.USERS;
  SEARCH: String = COMETCHAT_CONSTANTS.SEARCH;

  constructor(private userService: UserService, private signalRServise: SignalRService, private authService: AuthenticationService) {}

  ngOnInit() {
    try {
      this.userFilterCriteria = this.buildUserFilterCriteria();
      this.fetchNextUserList();
      this.attachListeners(this.userUpdated);
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

  buildUserFilterCriteria(searchKeyword: string = null): UserFilterCriteria {
    return {
      limit: 30,
      pageNumber: 1,
      searchKeyword: searchKeyword
    };
  }

  fetchNextUserList() {
    try {
      this.userService.getUsers(this.userFilterCriteria).toPromise().then(
        (userList: User[]) => {
          const filteredUserList = userList.filter((user) => {
            const found = this.memberList.find((member) => user.id === member.id);
            const foundBanned = this.bannedMemberList.find((member) => user.id === member.id);
            if (found || foundBanned) {
              return false;
            }
            return true;
          });

          this.userlist = [...this.userlist, ...userList];

          this.filteredList = [...this.filteredList, ...filteredUserList];

          this.decoratorMessage = this.filteredList.length === 0 ? COMETCHAT_CONSTANTS.NO_USERS_FOUND : "";     
        },  
        (error: any) => {
          logger("User list fetching failed with error: ", error);
        }
      );

      this.userFilterCriteria.pageNumber++;
    } catch (error) {
      logger(error);
    }
  }

  handleScroll(event: any) {
    try {
      const bottom =  Math.round(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) === Math.round(event.currentTarget.clientHeight);

      if (bottom) this.fetchNextUserList();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Attaches the user listeners
   * @param function callback
   */
  attachListeners(callback) {
    try {
      // CometChat.addUserListener(
      //   this.userListenerId,
      //   new CometChat.UserListener({
      //     onUserOnline: (onlineUser) => {
      //       /* when someuser/friend comes online, user will be received here */
      //       callback(onlineUser);
      //     },
      //     onUserOffline: (offlineUser) => {
      //       /* when someuser/friend went offline, user will be received here */
      //       callback(offlineUser);
      //     },
      //   })
      // );
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Removes all the attached listeners
   * @param
   */
  removeListeners() {
    try {
      //CometChat.removeUserListener(this.userListenerId);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates user , based on user activity detected through listeners
   * @param Any user
   */
  userUpdated(user: User) {
    try {
      let userlist = [...this.userlist];

      //search for user
      let userKey = userlist.findIndex(u => u.id === user.id);

      //if found in the list, update user object
      if (userKey > -1) {
        let userObj = userlist[userKey];
        let newUserObj = Object.assign({}, userObj, user);
        userlist.splice(userKey, 1, newUserObj);

        this.userlist = userlist;
      }
    } catch (error) {
      logger(error);
    }
  };
  

  /**
   * Searches for a list of users matching the search key
   * @param Event e
   */
  searchUsers(event) {
    try {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      let searchKeyword = event.target.value;
      this.timeout = setTimeout(() => {
        this.decoratorMessage = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;

        this.userFilterCriteria = this.buildUserFilterCriteria(searchKeyword);

        this.userlist = [];
        this.membersToAdd = [];
        this.membersToRemove = [];
        this.filteredList = [];
        this.fetchNextUserList();
      }, 500);
    } catch (error) {
      logger(error);
    }
  };

  

  /**
   * Handles all the events emitted by child components
   * @param Event action
   */
  actionHandler(action: ActionEvent) {
    try {
      let data = action.payload;

      switch (action.type) {
        case enums.MEMBER_UPDATED: {
          this.membersUpdated(data.user, data.userState);
          break;
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Updates the memberToAdd list
   * @param Any user
   */
  membersUpdated(user: User, userState: boolean) {
    try {
      if (userState) {
        const members = [...this.membersToAdd];
        members.push(user);
        this.membersToAdd = [...members];
      } else {
        const membersToAdd = [...this.membersToAdd];
        const IndexFound = membersToAdd.findIndex((member) => member.id === user.id);
        if (IndexFound > -1) {
          membersToAdd.splice(IndexFound, 1);
          this.membersToAdd = [...membersToAdd];
        }
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * adds all the members of the memberToAdd list to the group
   * @param
   */
  updateMembers() {
    try {
      if (this.addBtnText == COMETCHAT_CONSTANTS.ADDING_MESSSAGE) {
        return;
      }

      this.addBtnText = COMETCHAT_CONSTANTS.ADDING_MESSSAGE;

      const roomId = this.room.id;
      const membersList: User[] = [];
      const memberIds: number[] = [];
      this.membersToAdd.forEach((newmember: User) => {
        
        //if a selected member is already part of the member list, don't add
        const IndexFound = this.memberList.findIndex((member) => member.id === newmember.id);
        console.log(this.memberList)
        if (IndexFound === -1) {
          memberIds.push(newmember.id)
          membersList.push(newmember);
          newmember[enums.TYPE] = enums.ADD;
        } 
      });
      if (membersList.length) {
        const membersToAdd = [];
        this.signalRServise.addRoomMembers(this.room.id, memberIds)
          .then((newMembers: User[]) => {
            if (newMembers.length) {
              for (let member of newMembers) {
                const found = this.userlist.find((user) => user.id === member.id);
                found[enums.SCOPE] = Constants.GROUP_MEMBER_SCOPE.PARTICIPANT;
                membersToAdd.push(found);
              }
              this.actionGenerated.emit({
                type: enums.ADD_GROUP_PARTICIPANTS,
                payload: membersToAdd,
              });
            }
            this.closeAddMembersView();
          })
          .catch((error) => {
            logger("addMembersToGroup failed with exception:", error);
          })
          .finally(() => {
            this.addBtnText = COMETCHAT_CONSTANTS.ADD;
          });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * emits an action to close the addMember modal
   */
  closeAddMembersView() {
    try {
      this.actionGenerated.emit({
        type: enums.CLOSE_ADD_VIEW_MEMBER,
        payload: null,
      });
    } catch (error) {
      logger(error);
    }
  }
}
