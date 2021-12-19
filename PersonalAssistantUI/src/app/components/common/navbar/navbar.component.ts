import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu'
import { AuthenticationService } from 'src/app/services/user/authentication.service';
import { Router } from '@angular/router';
import { SignalRService } from 'src/app/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  @Output() menuButtonClick = new EventEmitter();

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  
  title: string = 'Твій Помічник'
  
  constructor(public authService: AuthenticationService, private signalRService: SignalRService,
    private router: Router) { }

  ngOnInit() {
    if(this.authService.currentUserValue) {
      this.signalRService.userOnline();
    }
  }

  ngOnDestroy() {
    if(this.authService.currentUserValue) {
      this.signalRService.userOffline();
    }
  }

  onMenuButtonClick() {
    if(this.authService.currentUserValue) {
      this.menuButtonClick.emit();
    }      
  }

  logout() {
    this.signalRService.userOffline();
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}