import { Component, OnInit, Output, EventEmitter } from "@angular/core";
//import { CometChat } from "@cometchat-pro/chat";
import * as enums from "../../../../utils/enums";
import * as Constants from "../../../../utils/constants";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import { ActionEvent, Room } from "src/app/models";
import { AuthenticationService, RoomService, SignalRService } from "src/app/services";

@Component({
  selector: "cometchat-create-room",
  templateUrl: "./cometchat-create-room.component.html",
  styleUrls: ["./cometchat-create-room.component.css"],
})
export class CometChatCreateRoomComponent implements OnInit {
  error: string = null;
  passwordInput: boolean = false;
  name: string = "";
  type: string = "";
  password = "";

  createBtnText: String = COMETCHAT_CONSTANTS.CREATE;
  SELECT_GROUP_TYPE: String = COMETCHAT_CONSTANTS.SELECT_GROUP_TYPE;
  ENTER_GROUP_NAME: String = COMETCHAT_CONSTANTS.ENTER_GROUP_NAME;
  PUBLIC: String = COMETCHAT_CONSTANTS.PUBLIC;
  PRIVATE: String = COMETCHAT_CONSTANTS.PRIVATE;
  PASSWORD_PROTECTED: String = COMETCHAT_CONSTANTS.PASSWORD_PROTECTED;
  ENTER_GROUP_PASSWORD: String = COMETCHAT_CONSTANTS.ENTER_GROUP_PASSWORD;
  CREATE_GROUP: String = COMETCHAT_CONSTANTS.CREATE_GROUP;

  @Output() actionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  constructor(private authService: AuthenticationService, private signalRService: SignalRService) {}

  ngOnInit() {}

  /**
   * Changes the password according to the text entered by the user
   * @param Event event
   */
  passwordChangeHandler(event) {
    try {
      this.password = event.target.value;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Changes the Room Name according to the text entered by the user
   * @param Event event
   */
  nameChangeHandler(event) {
    try {
      this.name = event.target.value;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Changes the Type of group , according to the option seletced by the user by the user
   * @param Event event
   */
  typeChangeHandler(event) {
    try {
      this.type = event.target.value;

      if (this.type === enums.PROTECTED_GROUP) {
        this.passwordInput = true;
      } else {
        this.passwordInput = false;
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Validates all the room details that were entered before creating the room
   * @param
   */
  validate() {
    try {
      const roomName = this.name.trim();
      const roomType = this.type.trim();

      if (!roomName) {
        this.error = COMETCHAT_CONSTANTS.GROUP_NAME_BLANK;
        return false;
      }

      if (!roomType) {
        this.error = COMETCHAT_CONSTANTS.GROUP_TYPE_BLANK;
        return false;
      }

      if (roomType === enums.PROTECTED_GROUP) {
        const password = this.password;

        if (!password.length) {
          this.error = COMETCHAT_CONSTANTS.GROUP_PASSWORD_BLANK;

          return false;
        }
      }
      return true;
    } catch (error) {
      logger(error);
    }
  };

  /**
   * If the Room Data is successfully validated , below function creates the room
   * @param
   */
  createRoom() {
    try {
      if (!this.validate()) {
        return false;
      }

      if (this.createBtnText == COMETCHAT_CONSTANTS.CREATING_MESSSAGE) {
        return;
      }

      this.createBtnText = COMETCHAT_CONSTANTS.CREATING_MESSSAGE;

      const roomType = this.type.trim();

      const password = this.password;
      const name = this.name.trim();
      let type = Constants.GROUP_TYPE.PUBLIC;

      switch (roomType) {
        case enums.PUBLIC_GROUP:
          type = Constants.GROUP_TYPE.PUBLIC;
          break;
        case enums.PRIVATE_GROUP:
          type = Constants.GROUP_TYPE.PRIVATE;
          break;
        case enums.PROTECTED_GROUP:
          type = Constants.GROUP_TYPE.PROTECTED;
          break;
        default:
          break;
      }

      const room = new Room(name, type, Constants.RECEIVER_TYPE.GROUP, this.authService.currentUserValue.id, password);

      this.signalRService.createRoom(room)
        .then((room) => {
          this.resetRoomData();
          room.hasJoined = true;
          this.actionGenerated.emit({
            type: enums.GROUP_CREATED,
            payload: room,
          });
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.createBtnText = COMETCHAT_CONSTANTS.CREATE;
        });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Emits an action indicating the parent to close the create group view
   * @param
   */
  closeCreateGroupView() {
    try {
      this.actionGenerated.emit({
        type: enums.CLOSE_CREATE_GROUP_VIEW,
        payload: null,
      });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Resets all the Room creation form data to initial values
   * @param
   */
   resetRoomData() {
    try {
      this.error = null;
      this.passwordInput = false;
      this.name = "";
      this.type = "";
      this.password = "";
    } catch (error) {
      logger(error);
    }
  }
}
