import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filtered-transaction-modal',
  templateUrl: './filtered-transaction-modal.component.html',
  styleUrls: ['./filtered-transaction-modal.component.scss'],
})
export class FilteredTransactionModalComponent implements OnInit {
  //  dummy data
  transactions = [
    {
      time: 1575118800000,
      incoming: false,
      address: 'JLKJDLKSN3942390482393498JKSNK',
      fee: 0.25,
      amount: 0.000023,
      hash: 'dfjsdljfsadjhfklsdfsdjncnvksdjfisdjfkldf',
      confirmations: 1,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Chaofan',
    },
    {
      time: 1578700800000,
      incoming: true,
      address: 'HJSLKDJ3J8689JHKJHKJJNJKN73',
      fee: 0.25,
      amount: 0.000019,
      hash: 'sdfjsdashjdfwohehbvasndalsfasdfadsfdsfdf',
      confirmations: 2,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Chaofan',
    },
    {
      time: 1580475600000,
      incoming: false,
      address: 'KJKJNCJSHF7694JNBCEIWFJNF',
      fee: 0.25,
      amount: 0.000002,
      hash: 'fdsnvjnsdjpafhiaqhopajdvnjdnvkldmfdfjf',
      confirmations: 3,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Dee',
    },
    {
      time: 1584921600000,
      incoming: false,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 4,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Sunny',
    },
    {
      time: 1586959200000,
      incoming: false,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 5,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Serin',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
    {
      time: 1589810400000,
      incoming: true,
      address: 'JNAODJSA8234928JBJN9234Uh',
      fee: 0.25,
      amount: 0.00081,
      hash: 'jdfbfdsjkfjsdfoiweuryethbdcjaksnfas',
      confirmations: 6,
      // backend no this value
      amountAUD: 10,
      businessName: 'AEM',
      trader: 'Jakub',
    },
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  close() {
    this.modalCtrl.dismiss();
  }
}