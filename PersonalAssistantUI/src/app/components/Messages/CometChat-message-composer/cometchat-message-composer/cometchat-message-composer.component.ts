import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from "@angular/core";
import * as enums from "../../../../utils/enums";
import * as Constants from "../../../../utils/constants";

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { logger } from "../../../../utils/common";

import { OUTGOING_MESSAGE_SOUND } from "../../../../resources/audio/outgoingMessageSound";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { ActionEvent, Message, Room, User } from "src/app/models";
import { SignalRService } from "src/app/services/chat/signalr.service";
import { AuthenticationService } from "src/app/services";
@Component({
  selector: "cometchat-message-composer",
  templateUrl: "./cometchat-message-composer.component.html",
  styleUrls: ["./cometchat-message-composer.component.css"],
  animations: [
    trigger("FadeInFadeOut", [
      state(
        "normal",
        style({
          width: "0px",
        })
      ),
      state(
        "animated",
        style({
          width: "26px",
          margin: "auto 1px",
        })
      ),
      transition("normal=>animated", animate(500)),
    ]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateY(100%)" }),
        animate("400ms ease-in", style({ transform: "translateY(0%)" })),
      ]),
    ]),
  ],
})
export class CometChatMessageComposerComponent implements OnInit, OnChanges {
  @Input() room: Room = null;
  @Input() type: string = null;
  @Input() messageToBeEdited: Message = null;
  @Input() messageToReact = null;

  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();
  @Output() messageActionGenerated: EventEmitter<ActionEvent> = new EventEmitter<ActionEvent>();

  @ViewChild("imagePicker", { static: false }) imagePicker: ElementRef;
  @ViewChild("videoPicker", { static: false }) videoPicker: ElementRef;
  @ViewChild("audioPicker", { static: false }) audioPicker: ElementRef;
  @ViewChild("filePicker", { static: false }) filePicker: ElementRef;

  enableSendButton = false;
  messageSending: boolean = false;
  messageInput = "";
  messageType = "";
  checkAnimatedState = "normal";
  openEditMessageWindow: boolean = false;
  isTyping: any;

  ATTACH_FILE: String = COMETCHAT_CONSTANTS.ATTACH_FILE;
  ATTACH_VIDEO: String = COMETCHAT_CONSTANTS.ATTACH_VIDEO;
  ATTACH_AUDIO: String = COMETCHAT_CONSTANTS.ATTACH_AUDIO;
  ATTACH_IMAGE: String = COMETCHAT_CONSTANTS.ATTACH_IMAGE;
  ADD_EMOJI: String = COMETCHAT_CONSTANTS.ADD_EMOJI;
  ENTER_YOUR_MESSAGE_HERE: String = COMETCHAT_CONSTANTS.ENTER_YOUR_MESSAGE_HERE;
  EDIT_MESSAGE: String = COMETCHAT_CONSTANTS.EDIT_MESSAGE;

  constructor(private signalRService: SignalRService, private authService: AuthenticationService) {}

  ngOnChanges(change: SimpleChanges) {
    try {
      if (change[enums.MESSAGE_TO_BE_EDITED]) {
        //edit message only if its not null or undefined
        if (change[enums.MESSAGE_TO_BE_EDITED].currentValue) {
          this.openEditPreview();
        }
      }      
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {}

  /**
   * Update the Message to be sent on every key press
   * @param event
   */
  changeHandler(event) {
    try {
      this.startTyping();
      if (event.target.value.length > 0) {
        this.messageInput = event.target.value;
        this.enableSendButton = true;
      }
      if (event.target.value.length == 0) {
        this.enableSendButton = false;
        this.messageInput = "";
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Send the message if user hits ENTER-key
   * @param Event e
   */
  sendMessageOnEnter(event) {
    try {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        this.sendTextMessage(event.target.value);
        this.playAudio();
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Edit and Send a Text message
   * @param
   */
  editMessage(message: Message) {
    try {
      let content = this.messageInput.trim();
      let textMessage = new Message(
        this.authService.currentUserValue.id,
        this.room.id,
        content,
        Constants.MESSAGE_TYPE.TEXT,
        this.room.conversationType
      );
      textMessage.id = message.id;

      this.endTyping();

      this.signalRService.editMessage(textMessage)
        .then((message: Message) => {
          // clear
          this.messageInput = "";
          this.messageSending = false;
          this.closeEditPreview();
          this.enableSendButton = false;
          // notify
          this.messageActionGenerated.emit({
            type: enums.MESSAGE_EDITED,
            payload: message,
          });
        })
        .catch((error) => {
          this.messageSending = false;
          logger("Message editing failed with error:", error);
        });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Send Text Message
   * @param
   */
  sendTextMessage(content: string = "") {
    try {
      // Dont Send Blank text messages
      if (this.messageInput.trim().length == 0 && content.trim().length == 0) {
        return false;
      }

      // wait for the previous message to be sent before sending the current message
      if (this.messageSending) {
        return false;
      }

      this.messageSending = true;

      // If its an Edit and Send Message Operation , use Edit Message Function
      if (this.messageToBeEdited) {
        this.editMessage(this.messageToBeEdited);
        return false;
      }

      let messageInput: string = content !== null ? content.trim() : this.messageInput.trim();

      let textMessage = new Message(
        this.authService.currentUserValue.id,
        this.room.id,
        messageInput,
        Constants.MESSAGE_TYPE.TEXT,
        this.room.conversationType
      );

      // End Typing Indicator Function
      this.endTyping();

      this.signalRService.sendMessage(textMessage)
        .then((message: Message) => {
          this.messageInput = "";
          this.messageSending = false;

          // this Message Emitted will Be Appended to the existing Message List
          this.messageActionGenerated.emit({
            type: enums.MESSAGE_COMPOSED,
            payload: message,
          });

          //clearing Message Input Box
          this.messageInput = "";

          // Change the send button to reaction button
          setTimeout(() => {
            this.enableSendButton = false;
          }, 500);
        })
        .catch((error) => {
          logger("Message sending failed with error:", error);
          this.messageSending = false;
        });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens drawer to send media files and sets animation state
   */
  toggleFilePicker() {
    try {
      this.checkAnimatedState == "normal"
        ? (this.checkAnimatedState = "animated")
        : (this.checkAnimatedState = "normal");
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens window to select and upload video
   */
  getVideo() {
    try {
      this.videoPicker.nativeElement.click();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens window to select and upload audio
   */
  getAudio() {
    try {
      this.audioPicker.nativeElement.click();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens window to select and upload image
   */
  getImage() {
    try {
      this.imagePicker.nativeElement.click();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Opens window to select and upload file
   */
  getFile() {
    try {
      this.filePicker.nativeElement.click();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Loads and upload the video
   * @param
   */
  onVideoChange(event) {
    try {
      if (!event.target.files[0]) {
        return false;
      }
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener(
        enums.LOAD,
        () => {
          const newFile = new File(
            [reader.result],
            uploadedFile.name,
            uploadedFile
          );
          this.sendMediaMessage(newFile, Constants.MESSAGE_TYPE.VIDEO);
        },
        false
      );

      reader.readAsArrayBuffer(uploadedFile);

      this.videoPicker.nativeElement.value = "";
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Loads and upload the audio
   * @param
   */
  onAudChange(event) {
    try {
      if (!event.target.files[0]) {
        return false;
      }
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener(
        enums.LOAD,
        () => {
          const newFile = new File(
            [reader.result],
            uploadedFile.name,
            uploadedFile
          );
          this.sendMediaMessage(newFile, Constants.MESSAGE_TYPE.AUDIO);
        },
        false
      );

      reader.readAsArrayBuffer(uploadedFile);

      this.audioPicker.nativeElement.value = "";
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Loads and upload the image
   * @param
   */
  onImgChange(event) {
    try {
      if (!event.target.files[0]) {
        return false;
      }
      const uploadedFile = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener(
        enums.LOAD,
        () => {
          const newFile = new File(
            [reader.result],
            uploadedFile.name,
            uploadedFile
          );
          this.sendMediaMessage(newFile, Constants.MESSAGE_TYPE.IMAGE);
        },
        false
      );

      reader.readAsArrayBuffer(uploadedFile);

      this.imagePicker.nativeElement.value = "";
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Loads and upload the file
   * @param
   */
  onFileChange(event) {
    try {
      if (!event.target.files["0"]) {
        return false;
      }

      const uploadedFile = event.target.files["0"];
      var reader = new FileReader();
      reader.addEventListener(
        enums.LOAD,
        () => {
          const newFile = new File(
            [reader.result],
            uploadedFile.name,
            uploadedFile
          );
          this.sendMediaMessage(newFile, Constants.MESSAGE_TYPE.FILE);
        },
        false
      );

      reader.readAsArrayBuffer(uploadedFile);

      this.filePicker.nativeElement.value = "";
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Sends media messages eg. image,audio,file etc.
   * @param
   */
  sendMediaMessage(messageInput, messageType) {
    try {
      this.toggleFilePicker();
      if (this.messageSending) {
        return false;
      }
      this.messageSending = true;

      // let mediaMessage = new CometChat.MediaMessage(
      //   receiverId,
      //   messageInput,
      //   messageType,
      //   receiverType
      // );

      // if (this.parentMessageId) {
      //   mediaMessage.setParentMessageId(this.parentMessageId);
      // }

      // this.endTyping();

      // CometChat.sendMessage(mediaMessage)
      //   .then((response) => {
      //     this.messageSending = false;
      //     this.playAudio();
      //     this.actionGenerated.emit({
      //       type: enums.MESSAGE_COMPOSED,
      //       payLoad: [response],
      //     });
      //   })
      //   .catch((error) => {
      //     this.messageSending = false;
      //     logger("message sending failed with error Message_Composer ", error);
      //   });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * opens the edit message window
   * @param
   */
  openEditPreview() {
    try {
      this.openEditMessageWindow = true;
      this.messageInput = this.messageToBeEdited.text;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Closes the edit message window
   * @param
   */
  closeEditPreview() {
    try {
      this.openEditMessageWindow = false;
      this.messageToBeEdited = null;
      this.messageInput = "";
      this.actionGenerated.emit({
        type: enums.CLEAR_MESSAGE_TO_BE_UPDATED,
        payLoad: null,
      });
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Plays Audio When Message is Sent
   */
  playAudio() {
    try {
      let audio = new Audio();
      audio.src = OUTGOING_MESSAGE_SOUND;
      audio.play();
    } catch (error) {
      logger(error);
    }
  }

  /**
   *  When user starts typing sets typing indicator
   */
  startTyping(timer = null, metadata = null) {
    try {
      let typingInterval = timer || 5000;

      if (this.isTyping > 0) {
        return false;
      }
      let typingMetadata = metadata || undefined;

      // let typingNotification = new CometChat.TypingIndicator(
      //   receiverId,
      //   receiverType,
      //   typingMetadata
      // );
      // CometChat.startTyping(typingNotification);

      this.isTyping = setTimeout(() => {
        this.endTyping();
      }, typingInterval);
    } catch (error) {
      logger(error);
    }
  }

  /**
   * When user stops writing
   */
  endTyping(metadata = null) {
    try {

      let typingMetadata = metadata || undefined;

      // let typingNotification = new CometChat.TypingIndicator(
      //   receiverId,
      //   receiverType,
      //   typingMetadata
      // );
      // CometChat.endTyping(typingNotification);

      clearTimeout(this.isTyping);
      this.isTyping = null;
    } catch (error) {
      logger(error);
    }
  }
}
