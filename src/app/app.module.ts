import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';
import {TcCaseService} from './services/tc-case.service';
import {TcCommonFunctions} from './services/tc-common-functions';
import {TcOrganizationService} from './services/tc-organization.service';
import {LoginComponent} from './login/login.component';
import {TibcoCloudLoginComponent} from './tibco-cloud-login/tibco-cloud-login.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {HTTP} from '@ionic-native/http/ngx';
import {AuthGuard} from './guards/auth.guard';
import {TcCaseProcessesService} from './services/tc-case-processes.service';
import {TcDocumentService} from './services/tc-document.service';
import {CreateflowService} from './services/tc-createflow.service';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {LogisticsService} from './services/logistics.service';
// import { File } from '@ionic-native/file/ngx';

@NgModule({
    declarations: [AppComponent, LoginComponent, TibcoCloudLoginComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
    providers: [
        AuthGuard,
        CreateflowService,
        TcOrganizationService,
        TcCaseService,
        TcCommonFunctions,
        TcCaseProcessesService,
        TcDocumentService,
        LogisticsService,
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        QRScanner,
        HTTP,
        FileTransfer,
        WebView,
       // File,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
