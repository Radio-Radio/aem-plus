import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletsPageRoutingModule } from './wallets-routing.module';

import { WalletsPage } from './wallets.page';
import {ListComponent} from './list/list.component';
import {TotalTransactionComponent} from './total-transaction/total-transaction.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WalletsPageRoutingModule],
  declarations: [WalletsPage, ListComponent, TotalTransactionComponent],
})
export class WalletsPageModule {}
