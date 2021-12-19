import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import * as enums from "../../../../utils/enums";
import { EDIT_SCOPE_ICON } from "./resources/editScopeIcon";
import { BAN_ICON } from "./resources/banIcon";
import { KICK_ICON } from "./resources/kickIcon";
import { RIGHT_TICK_ICON } from "./resources/rightTickIcon";
import { CLOSE_ICON } from "./resources/closeIcon";
import * as Constants from "../../../../utils/constants";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import { ActionEvent, Room, User } from "src/app/models";
@Component({
  selector: "cometchat-view-room-member-list-item",
  templateUrl: "./cometchat-view-room-member-list-item.component.html",
  styleUrls: ["./cometchat-view-room-member-list-item.component.css"],
})
export class CometChatViewRoomMemberListItemComponent implements OnInit {
  @Input() room: Room = null;
  @Input() type = null;
  @Input() member: User = null;
  @Input() loggedInUser: User = null;

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  scope: string;
  showChangeScope: boolean = false;
  roles = {};
  roleCodes = [];
  hasGreaterRole: boolean = false;

  PARTICIPANT = Constants.GROUP_MEMBER_SCOPE.PARTICIPANT;
  YOU: String = COMETCHAT_CONSTANTS.YOU;

  editScopeIcon = EDIT_SCOPE_ICON;
  banIcon = BAN_ICON;
  kickIcon = KICK_ICON;
  rightTick = RIGHT_TICK_ICON;
  closeIcon = CLOSE_ICON;

  constructor() {}

  ngOnInit() {
    try {
      this.scope = this.member.scope;

      //checking if logged in user is owner
      if (this.room.ownerId === this.loggedInUser.id) {
        this.loggedInUser.scope = Constants.GROUP_MEMBER_SCOPE.OWNER;
      }

      // checking if the current member passed to member view is an owner
      if (this.room.ownerId === this.member.id) {
        this.member.scope = Constants.GROUP_MEMBER_SCOPE.OWNER;
      }

      this.setRoles();

      if (this.checkRoleAuthorityLevel(this.loggedInUser) > this.checkRoleAuthorityLevel(this.member)) {
        this.hasGreaterRole = true;
      }      
    } catch (error) {
      logger(error);
    }
  }

  /**
   * returns the level of authority on current item on the group
   * @param
   */
  checkRoleAuthorityLevel(user: User) {
    try {
      if (user.scope == Constants.GROUP_MEMBER_SCOPE.OWNER) {
        return 4;
      }

      if (user.scope == Constants.GROUP_MEMBER_SCOPE.ADMIN) {
        return 3;
      }

      if (user.scope == Constants.GROUP_MEMBER_SCOPE.MODERATOR) {
        return 2;
      }

      if (user.scope == Constants.GROUP_MEMBER_SCOPE.PARTICIPANT) {
        return 1;
      }

      return 1;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sets the values for the roles dropdown
   * @param
   */
  setRoles() {
    try {
      this.roles[Constants.GROUP_MEMBER_SCOPE.OWNER] =
        COMETCHAT_CONSTANTS.OWNER;
      this.roles[Constants.GROUP_MEMBER_SCOPE.ADMIN] =
        COMETCHAT_CONSTANTS.ADMINISTRATOR;
      this.roles[Constants.GROUP_MEMBER_SCOPE.MODERATOR] =
        COMETCHAT_CONSTANTS.MODERATOR;
      this.roles[Constants.GROUP_MEMBER_SCOPE.PARTICIPANT] =
        COMETCHAT_CONSTANTS.PARTICIPANT;

      this.roleCodes = [
        Constants.GROUP_MEMBER_SCOPE.ADMIN,
        Constants.GROUP_MEMBER_SCOPE.MODERATOR,
        Constants.GROUP_MEMBER_SCOPE.PARTICIPANT,
      ];
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Closes or opens  the edit scope dropdown field
   * @param
   */
  toggleChangeScope(show: boolean) {
    try {
      this.showChangeScope = show;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Closes or opens  the edit scope dropdown field
   * @param Event event
   */
  scopeChangeHandler(event) {
    try {
      this.scope = event.target.value;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * emits an event to update the scope of the current member
   * @param
   */
  updateMemberScope() {
    try {
      this.actionGenerated.emit({
        type: enums.CHANGE_SCOPE,
        payload: { member: this.member, scope: this.scope },
      });
      this.toggleChangeScope(false);
    } catch (error) {
      logger(error);
    }
  };

  /**
   * emits an event to ban  the current member
   * @param
   */
  banMember() {
    try {
      this.actionGenerated.emit({
        type: enums.BAN,
        payload: { member: this.member, scope: this.scope },
      });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * emits an event to kick the current member out of the group
   * @param
   */
  kickMember = () => {
    try {
      this.actionGenerated.emit({
        type: enums.KICK,
        payload: { member: this.member, scope: this.scope },
      });
    } catch (error) {
      logger(error);
    }
  };
}
