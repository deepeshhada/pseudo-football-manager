import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from  '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate() {
        if (this.authService.loggedIn()) {
            return false;
        } else {
            this.router.navigate(['/dashboard']);
            return true;
        }
    }
}