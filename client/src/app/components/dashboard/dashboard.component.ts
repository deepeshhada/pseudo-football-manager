import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username;
  fullname;
  club;
  nationality;
  bids;
  isPlayerBool;
  playerArray;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getDashboard().subscribe(profile => {
      this.playerArray = profile.user;
      this.username = profile.user.username;
      this.fullname = profile.user.fullname;
      this.club = profile.user.club;
      this.nationality = profile.user.nationality;
      this.bids = profile.user.bids;
      this.isPlayerBool = this.isPlayer();
    });
  }

  isPlayer() {
    if (this.bids == null ) {
      return false;
    } else {
      return true;
    }
  }

}
