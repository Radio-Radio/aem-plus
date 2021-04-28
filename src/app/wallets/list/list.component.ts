import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalController, ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { Wallet } from 'src/app/services/models/wallet.model';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { WalletsService } from 'src/app/services/wallets/wallets.service';

import { SelectWalletModalComponent } from '../select-wallet-modal/select-wallet-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() filteredWalletsArr;

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private walletsService: WalletsService,
    private notificationService: NotificationsService,
    private clipboard: Clipboard,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  getWalletNotiNum(address: string) {
    return this.notificationService.getWalletNotificationNums(address);
  }

  // ----   Select wallet or tokens modal:
  private openSelectWalletModal(wallet: Wallet, mode: string) {
    this.modalCtrl
      .create({
        component: SelectWalletModalComponent,
        componentProps: {
          selectedWallet: wallet, // pass the data of cilcked wallet
          mode: mode, // determine the navigation page: send | receive
        },
        cssClass: 'height-sixty-modal',
      })
      .then((modal) => {
        modal.present();
      });
  }

  navToWallet(wallet: Wallet, mode: string) {
    if (wallet.walletType === 'BTC') {
      this.router.navigate(['/tabnav', 'wallets', 'bitcoin', wallet.walletId]);
      return;
    }

    // --- other type of wallet, open the select token modal:
    this.openSelectWalletModal(wallet, mode);
  }

  selectWalletToken(wallet: Wallet, mode: 'send' | 'receive' | 'wallet') {
    if (wallet.walletType === 'BTC' && mode === 'send') {
      this.router.navigate(['/tabnav', 'wallets', 'send', wallet.walletId], { relativeTo: this.route });
      return;
    } else if (wallet.walletType === 'BTC' && mode === 'receive') {
      this.router.navigate(['/receive', wallet.walletId], { relativeTo: this.route });
      return;
    }
    //  not btc wallet, then open the modal:
    this.openSelectWalletModal(wallet, mode);
  }

  filterWallets(e: any) {
    const searchStr = e.target.value;
    this.filteredWalletsArr = this.walletsService.filterWallets(searchStr);
  }

  onCopyAddress(address: string) {
    this.clipboard.copy(address);
    this.toastCtrl
      .create({
        message: 'Address is copied!',
        duration: 3000,
        position: 'top',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }
}
