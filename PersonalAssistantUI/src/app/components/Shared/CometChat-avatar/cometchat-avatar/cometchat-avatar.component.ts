import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import * as enums from "../../../../utils/enums";
import { logger } from "../../../../utils/common";

@Component({
  selector: "cometchat-avatar",
  templateUrl: "./cometchat-avatar.component.html",
  styleUrls: ["./cometchat-avatar.component.css"],
})
export class CometChatAvatarComponent implements OnInit, OnChanges {
  @Input() name: string;
  @Input() avatar: any;
  @Input() userStatus: string;
  @Input() enableUserStatus: boolean = true;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(change: SimpleChanges) {
    try {
      // TODO && change[enums.AVATAR].previousValue !== change[enums.AVATAR].currentValue
      if (change[enums.AVATAR] || change[enums.NAME]) {
        this.setAvatarIfNotPresent();
      }
    } catch (error) {
      logger(error);
    }
  }

  ngOnInit() {
    try {
      this.setAvatarIfNotPresent();
    } catch (error) {
      logger(error);
    }
  }

  /**
   * If Avatar of user is not present Sets Avatar as First Character of Name
   */
  setAvatarIfNotPresent(): void {
    try {
      //if (this.avatar === undefined || this.avatar === null) {
        //console.log(this.avatar)
        const url = this.getAvatar(this.name, this.name?.charAt(0).toUpperCase());
        this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      //}
    } catch (error) {
      logger(error);
    }
  }

  /**
   * if a user doesn't have an avatar , it take the first character of username in data paramter and converts it into an svg image
   * @param
   */
  getAvatar(generator: string, data: string) {
    try {
      const svg1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svg1.setAttribute("width", "200");
      svg1.setAttribute("height", "200");

      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", "0");
      rect.setAttribute("y", "0");
      rect.setAttribute("width", "200");
      rect.setAttribute("height", "200");
      rect.setAttribute("fill", this.stringToColour(generator));
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", "50%");
      text.setAttribute("y", "54%");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "120");
      text.setAttribute("font-family", "'Inter', sans-serif");
      text.setAttribute("font-wight", "600");
      text.textContent = data;
      svg1.appendChild(rect);
      svg1.appendChild(text);
      let svgString = new XMLSerializer().serializeToString(svg1);

      let decoded = unescape(encodeURIComponent(svgString));
      let base64 = btoa(decoded);

      let imgSource = `data:image/svg+xml;base64,${base64}`;
      return imgSource;
    } catch (error) {
      logger(error);
    }
  };

  stringToColour(str: string): string {
    try {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let colour = "#";
      for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        colour += ("00" + value.toString(16)).substr(-2);
      }
      return colour;
    } catch (error) {
      logger(error);
    }
  };
}
