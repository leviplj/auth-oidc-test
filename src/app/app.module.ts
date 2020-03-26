import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';


const oidc_configuration = 'assets/auth.clientConfiguration.json';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule.forRoot(),
  ],
  providers: [
    OidcConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: loadConfig,
        deps: [OidcConfigService],
        multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        // Use the configResult to set the configurations

        const config: OpenIdConfiguration = {
            stsServer: configResult.customConfig.stsServer,
            redirect_url: configResult.customConfig.redirect_url,
            client_id: configResult.customConfig.client_id,
            scope: 'openid profile email',
            response_type: 'code',
            silent_renew: true,
            silent_renew_url: 'https://localhost:4200/silent-renew.html',
            log_console_debug_active: true,
            // all other properties you want to set
        };

        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
}

}
