import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'report-tab',
        children: [
          {
            path: '',
            loadChildren: '../report-tab/report-tab.module#ReportTabPageModule'
          }
        ]
      },
      {
        path: 'welcome-tab',
        children: [
          {
            path: '',
            loadChildren: '../welcome-tab/welcome-tab.module#WelcomeTabPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/report-tab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
