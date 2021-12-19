import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as Constants from "../../../../utils/constants";
import * as enums from "../../../../utils/enums";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import { ActionEvent, Room, User } from "src/app/models";
import { SignalRService } from "src/app/services";

@Component({
  selector: "cometchat-view-room-member-list",
  templateUrl: "./cometchat-view-room-member-list.component.html",
  styleUrls: ["./cometchat-view-room-member-list.component.css"],
})
export class CometChatViewRoomMemberListComponent implements OnInit {
  @Input() room: Room = null;
  @Input() type = null;
  @Input() loggedInUser: User = null;
  @Input() memberList: User[] = [];

  PARTICIPANT = Constants.GROUP_MEMBER_SCOPE.PARTICIPANT;
  NAME: String = COMETCHAT_CONSTANTS.NAME;
  SCOPE: String = COMETCHAT_CONSTANTS.SCOPE;
  GROUP_MEMBERS: String = COMETCHAT_CONSTANTS.GROUP_MEMBERS;
  BAN: String = COMETCHAT_CONSTANTS.BAN;
  KICK: String = COMETCHAT_CONSTANTS.KICK;

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  constructor(private signalRService: SignalRService) { }

  ngOnInit() { }

  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action: ActionEvent) {
    try {
      let data = action.payload;

      switch (action.type) {
        case enums.CHANGE_SCOPE: {
          this.changeScope(data.member, data.scope);
          break;
        }
        case enums.BAN: {
          this.banMember(data.member);
          break;
        }
        case enums.KICK: {
          this.kickMember(data.member);
          break;
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Changes the scope of a member of a group
   * @param Any member
   */
  changeScope(member: User, scope: string) {
    try {
      const roomId = this.room.id;
      console.log('TODO -> changeScope!')
      // CometChat.updateGroupMemberScope(guid, member.id, scope)
      //   .then((response) => {
      //     if (response) {
      //       logger("updateGroupMemberScope success with response: ", response);
      //       const updatedMember = Object.assign({}, member, { scope: scope });
      //       this.actionGenerated.emit({
      //         type: enums.UPDATE_GROUP_PARTICIPANTS,
      //         payLoad: updatedMember,
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     logger("updateGroupMemberScope failed with error: ", error);
      //   });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Bans a  member of a group
   * @param Any memberToBan
   */
  banMember(memberToBan: User) {
    try {
      console.log('TODO -> banMember!')
      const roomId = this.room.id;
      // CometChat.banGroupMember(guid, memberToBan.uid)
      //   .then((response) => {
      //     if (response) {
      //       logger("banGroupMember success with response: ", response);
      //       this.actionGenerated.emit({
      //         type: enums.REMOVE_GROUP_PARTICIPANTS,
      //         payLoad: memberToBan,
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     logger("banGroupMember failed with error: ", error);
      //   });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * kicks the member member of a group
   * @param Any memberToKick
   */
  kickMember(memberToKick: User) {
    try {
      this.signalRService.removeRoomMember(this.room.id, memberToKick.id)
        .then((user: User) => {
          if (user) {
            logger("Room member remove success with response: ", user.id);
            this.actionGenerated.emit({
              type: enums.REMOVE_GROUP_PARTICIPANTS,
              payload: memberToKick,
            });
          }
        })
        .catch((error) => {
          logger("Room member remove failed with error: ", error);
        });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Emits an action to indicate the parent component to close the view member modal
   * @param
   */
  closeViewMemberModal() {
    try {
      this.actionGenerated.emit({
        type: enums.OPEN_VIEW_MEMBER,
        payload: null,
      });
    } catch (error) {
      logger(error);
    }
  }
}
