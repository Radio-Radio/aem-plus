import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tabnav/wallets', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },

  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: '',
    loadChildren: () => import('./tabnav/tabnav.module').then((m) => m.TabnavPageModule),
  },
  {
    path: 'send',
    loadChildren: () => import('./send/send.module').then((m) => m.SendPageModule),
  },
  {
    path: 'choose-send-account',
    loadChildren: () =>
      import('./send/choose-send-account/choose-send-account.module').then((m) => m.ChooseSendAccountPageModule),
  },
  {
    path: 'receive',
    loadChildren: () => import('./receive/receive.module').then((m) => m.ReceivePageModule),
  },
  {
    path: 'choose-receive-account',
    loadChildren: () =>
      import('./receive/choose-receive-account/choose-receive-account.module').then(
        (m) => m.ChooseReceiveAccountPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
