import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";
import { Conversation, Message, Room, User } from "src/app/models";

@Component({
  selector: "cometchat-nav-bar",
  templateUrl: "./cometchat-nav-bar.component.html",
  styleUrls: ["./cometchat-nav-bar.component.css"],
})
export class CometChatNavBarComponent implements OnInit {
  @Input() room: Room = null;
  @Input() loggedInUser: Room = null;
  @Input() lastMessage: Message;
  @Input() enableSelectedGroupStyling = false;
  @Input() roomToUpdate: Room = null;
  @Input() roomToLeave: Room = null;
  @Input() roomToDelete: Room = null;

  @Output() actionGenerated: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUserClick: EventEmitter<User> = new EventEmitter<User>();
  @Output() onRoomClick: EventEmitter<Room> = new EventEmitter<Room>();
  @Output() onConversationClick: EventEmitter<Conversation> = new EventEmitter<Conversation>();

  displayConversationList: boolean = true;
  displayRoomList: boolean = false;
  displayUserList: boolean = false;
  displayUserInfoScreen: boolean = false;

  roomMessage = [];
  curentRoom: Room;
  
  constructor() {}

  ngOnInit() {}

  /**
   * Toggles the List to be opened on user clicked
   * @param
   */
  checkScreen(tabType: string) {
    try {
      this.displayConversationList = tabType === enums.CONVERSATION_LIST;
      this.displayRoomList = tabType === enums.GROUP_LIST;
      this.displayUserList = tabType === enums.USER_LIST;
      this.displayUserInfoScreen = tabType === enums.INFO_SCREEN;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens ConversationList
   */
  openConversationList() {
    try {
      this.checkScreen(enums.CONVERSATION_LIST);
      this.closeDetailView();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens GroupList
   */
  openRoomList() {
    try {
      this.checkScreen(enums.GROUP_LIST);
      this.closeDetailView();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens userlist
   */
  openUserList() {
    try {
      this.checkScreen(enums.USER_LIST);
      this.closeDetailView();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens User Info Screnn
   */
  openUserInfoScreen() {
    try {
      this.checkScreen(enums.INFO_SCREEN);
      this.closeDetailView();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Closes Detail View when tab is changed
   */
  closeDetailView() {
    try {
      this.actionGenerated.emit({
        type: enums.TAB_CHANGED,
      });
    } catch (error) {
      logger(error);
    }
  }
  
  /**
   * Listen to the conversation emitted by the conversationList component
   * @param Event user
   */
   conversationClicked(conversation: Conversation) {
    try {
      this.room = conversation.room;
      this.room = conversation.room;
      this.lastMessage = conversation.lastMessage;
      this.onConversationClick.emit(conversation);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listen to the user emitted by the userList component
   * @param Event user
   */
  userClicked(user: User) {
    try {
      //this.type = Constants.RECEIVER_TYPE.USER
      // TODO set room with user
      //this.room = user;
      //this.curentItem = user;
      this.onUserClick.emit(user);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Listen to the room emitted by the roomList component
   * @param Event room
   */
  roomClicked(room: Room) {
    try {
      this.room = room;
      this.curentRoom = room;

      this.onRoomClick.emit(room);
    } catch (error) {
      logger(error);
    }
  }
}
