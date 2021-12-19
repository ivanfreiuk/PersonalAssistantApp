import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers';
import { ComponentsModule } from './components/components.module';
import { CometChatConversationList, CometChatRoomList, CometChatUI, CometChatUserList } from './public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ComponentsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CometChatUserList,
    CometChatRoomList,
    CometChatConversationList,
    CometChatUI
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
