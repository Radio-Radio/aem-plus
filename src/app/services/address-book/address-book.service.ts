import { Injectable } from '@angular/core';

import { addressesList } from '../dummyData/address-list.data';
import { Address } from '../models/address.modal';

@Injectable({
  providedIn: 'root',
})
export class AddressBookService {
  addressesList: Address[] = addressesList;

  constructor() {}

  getAddressesList() {
    return this.addressesList;
  }

  filteredAddresses(inputVal: string) {
    return inputVal && inputVal.trim() !== ''
      ? this.addressesList.filter((address) => {
          return address.name.toLowerCase().indexOf(inputVal.toLowerCase()) > -1;
        })
      : this.addressesList;
  }
}
