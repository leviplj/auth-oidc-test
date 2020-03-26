import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  userData: any;
  token: any
  idToken: any

  constructor(public oidcSecurityService: OidcSecurityService) {
      if (this.oidcSecurityService.moduleSetup) {
          this.doCallbackLogicIfRequired();
      } else {
          this.oidcSecurityService.onModuleSetup.subscribe(() => {
              this.doCallbackLogicIfRequired();
          });
      }
  }

  ngOnInit() {
      this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
          this.isAuthenticated = auth;
      });

      this.oidcSecurityService.getUserData().subscribe(userData => {
          this.userData = userData;

          this.token = this.userData ? this.oidcSecurityService.getToken() : ''
          this.idToken = this.userData ? this.oidcSecurityService.getIdToken() : ''
      });
  }

  ngOnDestroy(): void {}

  login() {
      this.oidcSecurityService.authorize();
  }

  logout() {
      this.oidcSecurityService.logoff();
  }

  private doCallbackLogicIfRequired() {
      // Will do a callback, if the url has a code and state parameter.
      this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
  }
}
