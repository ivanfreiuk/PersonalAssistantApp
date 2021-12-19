import { Component, Input, OnInit } from "@angular/core";
import { COMETCHAT_CONSTANTS } from "../../../../utils/messageConstants";
import { logger } from "../../../../utils/common";
import * as enums from "../../../../utils/enums";
import { Message } from "src/app/models";

@Component({
  selector: "cometchat-read-receipt",
  templateUrl: "./cometchat-read-receipt.component.html",
  styleUrls: ["./cometchat-read-receipt.component.css"],
})
export class CometChatReadReceiptComponent implements OnInit {
  @Input() messageDetails: Message = null;
  @Input() displayReadReciept = true;

  tickStatus: string;
  time: Date;

  SENT: string = COMETCHAT_CONSTANTS.SENT;
  DELIVERED: string = COMETCHAT_CONSTANTS.DELIVERED;
  READ: string = enums.READ;
  constructor() {}

  ngOnInit() {
    try {
      this.getDeliveryStatus();
      this.time = this.messageDetails.sentAt;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * Get Read/Deliv/Sent Status
   */
  getDeliveryStatus() {
    try {
      if (this.messageDetails.sentAt) {
        this.tickStatus = this.SENT;

        if (this.messageDetails.sentAt) {
          this.tickStatus = this.DELIVERED;
        }
        if (this.messageDetails.editedAt) {
          this.tickStatus = this.READ;
        }
      }
    } catch (error) {
      logger(error);
    }
  }
}
