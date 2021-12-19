import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  SimpleChanges,
  ViewRef,
} from "@angular/core";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";
import { User } from "src/app/models/user/user";
import { AuthenticationService } from "src/app/services/user/authentication.service";
import { UserFilterCriteria } from "src/app/models";
import { UserService } from "src/app/services/user/user.service";
@Component({
  selector: "cometchat-user-list",
  templateUrl: "./cometchat-user-list.component.html",
  styleUrls: ["./cometchat-user-list.component.css"],
})
export class CometChatUserListComponent
  implements OnInit, OnDestroy, OnChanges {
  //@Input() user: User = null;

  @Output() onUserClick: EventEmitter<User> = new EventEmitter<User>();
  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();

  userListenerId: string | null = enums.USER_LIST_ + new Date().getTime();

  decoratorMsg: string = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;
  userSearches: boolean = false;
  loader: Boolean = true;
  contactsNotFound: Boolean = false;
  contacts = [];
  usersList: User[] = [];
  userFilterCriteria: UserFilterCriteria;
  timeout: any;
  defaultAvatarImage = "https://data-eu.cometchat.io/assets/images/avatars/spiderman.png";

  USERS: String = COMETCHAT_CONSTANTS.USERS;
  SEARCH: String = COMETCHAT_CONSTANTS.SEARCH;

  constructor(private ref: ChangeDetectorRef, private authService: AuthenticationService, private userService: UserService) {
    try {      
      setInterval(() => {
        if (!(this.ref as ViewRef).destroyed) {
          this.ref.detectChanges();
        }
      }, 5000);
    } catch (error) {
      logger(error);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    try { 
      if (change[enums.USER]) {
        if (change[enums.USER].previousValue !== change[enums.USER].currentValue ) {
          const userlist = [...this.usersList];

          let userKey = userlist.findIndex(
            (u, k) => u.id === change[enums.USER].currentValue.id
          );

          //if found in the list, update user object
          if (userKey > -1) {
            let userObj = userlist[userKey];
            let newUserObj = Object.assign(
              {},
              userObj,
              change[enums.USER].currentValue
            );
            userlist.splice(userKey, 1, newUserObj);
            this.usersList = [...userlist];
          }
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.loader = false;
      this.userFilterCriteria = this.buildUserFilterCriteria();
      this.fetchNextContactList();

      //Attaching User Listeners to dynamilcally update when a user comes online and goes offline
      // CometChat.addUserListener(
      //   this.userListenerId,
      //   new CometChat.UserListener({
      //     onUserOnline: (onlineUser) => {
      //       /* when someuser/friend comes online, user will be received here */

      //       this.userUpdated(onlineUser);
      //     },
      //     onUserOffline: (offlineUser) => {
      //       /* when someuser/friend went offline, user will be received here */

      //       this.userUpdated(offlineUser);
      //     },
      //   })
      //);
    } catch (error) {
      logger(error);
    }
  }

  ngOnDestroy() {
    try {
      // removinf the changeDetector Ref
      this.ref.detach();

      //CometChat.removeUserListener(this.userListenerId);
      this.userListenerId = null;
      this.userFilterCriteria = null;
    } catch (error) {
      logger(error);
    }
  }

  searchUsers(searchKey: string) {
    try {
      this.contactsNotFound = false;
      this.decoratorMsg = COMETCHAT_CONSTANTS.LOADING_MESSSAGE;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.userSearches = true;
      this.loader = true;
      this.timeout = setTimeout(() => {
        // Empty Intial User List before searching user list according to search key
        this.usersList = [];

        this.userFilterCriteria = this.buildUserFilterCriteria(searchKey);

        this.fetchNextContactList();
      }, 500);
    } catch (error) {
      logger(error);
    }
  }

  
  handleScroll(event: any) {
    try {
      const bottom =  Math.round(event.currentTarget.scrollHeight - event.currentTarget.scrollTop) === Math.round(event.currentTarget.clientHeight);

      if (bottom) this.fetchNextContactList();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Get List of users that are contacts of the current user
   *
   */
  fetchNextContactList() {
    try {
      this.userService.getUsers(this.userFilterCriteria).toPromise().then(
        (userList: User[]) => {
          if (userList.length === 0 && this.userSearches === true) {
            this.contactsNotFound = true;
            this.decoratorMsg = COMETCHAT_CONSTANTS.NO_USERS_FOUND;
          } else {
            this.userSearches = false;
            this.usersList = [...this.usersList, ...userList];
            this.loader = false;
          }
        },  
        (error: any) => {
          logger("User list fetching failed with error:", error);
        }
      );

      this.userFilterCriteria.pageNumber++;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * This function updates the status ( online / offline ) , in real-time when getting signals from the listerners
   * @param Any user
   */
  userUpdated(user: User) {
    try {
      let itemIndex = this.usersList.findIndex(u => u.id == user.id);
      this.usersList[itemIndex] = user;

      let userlist = [...this.usersList];

      //search for user
      let userKey = userlist.findIndex(u => u.id === user.id);

      //if found in the list, update user object
      if (userKey > -1) {
        let userObj = { ...userlist[userKey] };
        let newUserObj = { ...userObj, ...user };
        userlist.splice(userKey, 1, newUserObj);

        this.usersList = [...userlist];
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Emitting the user clicked so that it can be used in the parent component
   * @param Any userToEmit
   */
  onUserClicked(user: User) {
    try {
      this.onUserClick.emit(user);
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
}
