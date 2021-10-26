import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
    Account,
    AccountHttp,
    Address,
    Crypto,
    Deadline,
    Mosaic,
    MosaicHttp,
    MosaicId,
    MosaicInfo,
    MosaicNames,
    NamespaceHttp,
    NetworkType,
    Password,
    PlainMessage,
    SimpleWallet,
    Transaction,
    TransactionGroup,
    TransactionHttp,
    TransactionStatusHttp,
    TransferTransaction,
    UInt64,
    RepositoryFactoryHttp,
    TransactionType,
    BlockInfo,
    ChainInfo,
} from 'symbol-sdk';
import { Observable } from 'rxjs';
import { MnemonicPassPhrase, Wallet, Network, ExtendedKey } from 'symbol-hd-wallets';
import { timeout } from 'rxjs/operators';

import { NodeWalletProvider } from 'src/app/services/node-wallet/node-wallet.provider';

import { environment } from 'src/environments/environment';

const REQUEST_TIMEOUT = 5000;

/*
 Generated class for the BitcoinProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable({ providedIn: 'root' })
export class SymbolProvider {
    accountHttp: AccountHttp;
    mosaicHttp: MosaicHttp;
    namespaceHttp: NamespaceHttp;
    transactionHttp: TransactionHttp;
    transactionStatusHttp: TransactionStatusHttp;
    mnemonicPassphrase: MnemonicPassPhrase;
    repositoryFactory: RepositoryFactoryHttp;

    public node: string = environment.SYMBOL_NODE_DEFAULT;
    public isNodeAlive: boolean = false;

    //FIXME change mosaic id and generation hash
    // public readonly symbolMosaicId = '6BED913FA20223F8'; MAIN NET
    public readonly symbolMosaicId = '091F837E059AE13C'; // TEST NET
    public readonly epochAdjustment = 1615853185;
    public readonly networkGenerationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    private static readonly DEFAULT_ACCOUNT_PATH_MAIN_NET = `m/44'/4343'/0'/0'/0'`;
    private static readonly DEFAULT_ACCOUNT_PATH_TEST_NET = `m/44'/1'/0'/0'/0'`;

    constructor(
      private storage: Storage,
      private nodeWallet: NodeWalletProvider,
    ) {
        this.updateNodeStatus();
        setInterval(() => this.updateNodeStatus(), 2500);
    }


    public async setNodeSymbolWallet(walletId: string) {
        try {
            const nodeWallet = await this.nodeWallet.getNodeWalletByWalletId(walletId);
            if (nodeWallet) {
                this.setNode(nodeWallet.selectedNode);
            } else {
                this.setNode(this.node);
            }
        }catch (e) {
            this.setNode(this.node);
            console.log('nem.provider' , 'setNodeNEMWallet()', 'error', e);
        }
        console.log('node-symbol', this.node);
    }

    /**
     * Sets custom node for requests
     * @param node
     */
    public setNode(node: string) {
        this.node = node;
        this.accountHttp = new AccountHttp(this.node);
        this.mosaicHttp = new MosaicHttp(this.node);
        this.namespaceHttp = new NamespaceHttp(this.node);
        this.transactionHttp = new TransactionHttp(this.node);
        this.transactionStatusHttp = new TransactionStatusHttp(this.node);
        this.repositoryFactory = new RepositoryFactoryHttp(this.node);
    }

    /**
     * Create simple wallet by a given mnemonic
     * @param walletName
     * @param mnemonic
     * @param password
     */
    public createMnemonicWallet(walletName: string, mnemonic: string, password: string): SimpleWallet {
        const mnemonicPassPhrase = new MnemonicPassPhrase(mnemonic);
        const derivationPath = SymbolProvider.DEFAULT_ACCOUNT_PATH_TEST_NET;
        const mnemonicSeed = mnemonicPassPhrase.toSeed().toString('hex');
        const xkey = ExtendedKey.createFromSeed(mnemonicSeed, Network.SYMBOL);
        const wallet = new Wallet(xkey);
        const pk = wallet.getChildAccountPrivateKey(derivationPath);
        return SimpleWallet.createFromPrivateKey('symbol', new Password(password), pk, NetworkType.TEST_NET);
    }


    /**
     * Create simple wallet by a given private key
     * @param walletName
     * @param privateKey
     * @param password
     */
    public createPrivateKeyWallet(walletName: string, privateKey: string, password: string): SimpleWallet {
        return SimpleWallet.createFromPrivateKey('symbol', new Password(password), privateKey, NetworkType.TEST_NET);
    }

    /**
     * Gets private key from password and account
     * @param password
     * @param wallet
     * @return promise with selected wallet
     */
    public passwordToPrivateKey(password: string, wallet: SimpleWallet): string {
        return wallet.open(new Password(password)).privateKey;
    }

    /**
     * Generate Address QR Text
     * @param address address
     * @return Address QR Text
     */
    public generateAddressQRText(address: Address): string {
        return JSON.stringify({
            data: {
                addr: address.plain(),
                name: 'wallet',
            }
        });
    }

    /**
     * Generate Address QR Text
     * @param address address
     * @param amount
     * @param message
     * @return Address QR Text
     */
    public generateInvoiceQRText(address: Address, amount: number, message: string): string {
        return JSON.stringify({
            data: {
                addr: address.plain(),
                amount: amount,
                msg: message
            }
        });
    }

    /**
     * Get mosaics form an account
     * @param address address to check balance
     * @return Promise with mosaics information
     */
    public async getBalance(address: Address): Promise<{ mosaic: Mosaic, info: MosaicInfo, namespaceNames: MosaicNames }[]> {
        try {
            const accountInfo = await this.accountHttp.getAccountInfo(address).toPromise();

            const mosaicNames = await Promise.all(accountInfo.mosaics.map(mosaic => {
                if (mosaic.id instanceof MosaicId) {
                    return this.namespaceHttp.getMosaicsNames([mosaic.id]).toPromise();
                }
                return null;
            }));

            const mosaicInfos = await Promise.all(accountInfo.mosaics.map(mosaic => {
                if (mosaic.id instanceof MosaicId) {
                    return this.mosaicHttp.getMosaic(mosaic.id).toPromise();
                }
            }));

            return accountInfo.mosaics.map((mosaic, idx) => {
                return {
                    mosaic: mosaic,
                    info: mosaicInfos[idx],
                    namespaceNames: mosaicNames[idx][0]
                };
            });
        } catch (e) {
            const names = await this.namespaceHttp.getMosaicsNames([new MosaicId(this.symbolMosaicId)]).toPromise();
            const info = await this.mosaicHttp.getMosaic(new MosaicId(this.symbolMosaicId)).toPromise();
            return [{
                mosaic: new Mosaic(new MosaicId(this.symbolMosaicId), UInt64.fromUint(0)),
                info: info,
                namespaceNames: names[0]
            }];
        }
    }

    getAddress(rawAddress: string): Address {
        try {
            return Address.createFromRawAddress(rawAddress);
        } catch (e) {
            console.log('symbol.provider', 'getAddress()', 'error', e);
            return null;
        }
    }

    /**
     * Get symbol balance from an account
     * @param rawAddress address to check balance
     * @return Promise with mosaics information
     */
    async getXYMBalance(rawAddress: string): Promise<number> {
        try {
            const address: Address = Address.createFromRawAddress(rawAddress);

            const balances = await this.getBalance(address);

            const balanceByMosaicId = balances.find((item) => item.mosaic.id.toHex() === this.symbolMosaicId);

            if (balanceByMosaicId) {
                const mosaic: Mosaic = balanceByMosaicId.mosaic;
                const mosaicInfo: MosaicInfo = balanceByMosaicId.info;
                const mathPow = Math.pow(
                  10, mosaicInfo.divisibility
                );
                const balance = mosaic.amount.compact() / mathPow;
                return balance;
            } else {
                return 0;
            }
        }catch (e) {
            console.log('symbol.provider', 'getXYMBalance()', 'error:', e);
            return 0;
        }
    }

    public async getAmountTxs(transferTxs: TransferTransaction): Promise<number> {
        try {
            if (transferTxs.type === TransactionType.TRANSFER) {
                const mosaic: Mosaic = this.getMosaicByTransaction(transferTxs);
                const divisibility = await this.getDivisibility(mosaic.id as MosaicId);
                const mathPow = Math.pow(10, divisibility);
                const amount = mosaic.amount.compact() / mathPow;
                return amount;
            }
        }catch (e) {
            console.log('symbol.provider', 'getBalanceTxs', 'error', e);
            return 0;
        }
        return 0;
    }

    public async getXYMPaidFee(transferTxs: TransferTransaction): Promise<number> {
        try {
            const blockInfo = await this.getBlockInfo(transferTxs.transactionInfo.height);
            const mosaic = this.getMosaicByTransaction(transferTxs);
            const divisibility = await this.getDivisibility(mosaic.id as MosaicId);
            const mathPow = Math.pow(10, divisibility);
            const fee = (blockInfo.feeMultiplier * transferTxs.size) / mathPow;
            return fee ;
        }catch (e) {
            console.log('symbol.provider', 'getXYMPaidFee()', 'error', e);
            return 0;
        }
    }

    public getBlockInfo(height: UInt64): Promise<BlockInfo> {
        return this.repositoryFactory.createBlockRepository().getBlockByHeight(height).toPromise();
    }

    public getSymbolChainInfo(): Promise<ChainInfo> {
        return this.repositoryFactory.createChainRepository().getChainInfo().toPromise();
    }

    public async getSymbolTokens(address: Address): Promise<any[]> {
        try {
            const balance = await this.getBalance(address);
            const chainInfo = await this.getSymbolChainInfo();
            const currentHeight = chainInfo.height.compact();

            const tokens = balance.filter((value) => {

                const duration = value.info.duration.compact();
                const startHeight = value.info.startHeight.compact();
                const expiresIn = startHeight + duration - (currentHeight || 0);

                const unlimited = duration === 0;
                const expired = expiresIn <= 0;
                return unlimited || !expired;
            });
            return tokens;
        }catch (e) {
            console.log('symbol.provider', 'getSymbolTokens', 'error', e);
            return [];
        }
    }

    public getMosaicInfo(mosaicId: MosaicId): Promise<MosaicInfo> {
        return this.mosaicHttp.getMosaic(mosaicId).toPromise();
    }

    public async getDivisibility(mosaicId: MosaicId): Promise<number> {
        try {
            const mosaicInfo = await this.getMosaicInfo(mosaicId);
            return mosaicInfo.divisibility;
        }catch (e) {
            console.log('symbol.provider', 'getDivisibility', 'error', e);
            // TODO: add to ENV config
            return 6; // 6 by default
        }
    }

    public getMosaicByTransaction(transferTxs: TransferTransaction): Mosaic {
        const mosaicId = new MosaicId(this.symbolMosaicId);
        return transferTxs.mosaics.find((mosaic) => mosaic.id.equals(mosaicId));
    }


    isIncomingTxs(transaction: TransferTransaction, currentSignerAddress: Address): boolean {
        return transaction.recipientAddress && currentSignerAddress && transaction.recipientAddress.equals(currentSignerAddress);
    }

    public prepareMosaicTransaction(recipientAddress: Address, mosaics: Mosaic[], message: string): TransferTransaction {
        return TransferTransaction.create(
            Deadline.create(this.epochAdjustment),
            recipientAddress,
            mosaics,
            PlainMessage.create(message),
            recipientAddress.networkType,
            UInt64.fromUint(50000));
    }

    /**
     * Formats levy given mosaic object
     * @param mosaic mosaic object
     * @return Promise with levy fee formated
     *//*
public formatLevy(mosaic: MosaicTransferable): Promise<number> {

}

/**
 * Check if acount belongs it is valid, has 40 characters and belongs to network
 * @param address address to check
 * @return Return prepared transaction
 *//*
      public isValidAddress(address: Address): boolean  {

      }

      /**
       * Prepares xem transaction
       * @param recipientAddress recipientAddress
       * @param amount amount
       * @param message message
       * @return Return transfer transaction
       *//*
  public prepareTransaction(recipientAddress: Address, amount: number, message: string): TransferTransaction {

  }

  /**
   * Prepares mosaic transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */

    /**
     * Send transaction into the blockchain
     * @param transferTransaction transferTransaction
     * @param wallet wallet
     * @param password password
     * @return Promise containing sent transaction
     */
    public async confirmTransaction(transferTransaction: TransferTransaction, wallet: SimpleWallet, password: string): Promise<string> {
        const account = wallet.open(new Password(password));

        const signedTx = account.sign(transferTransaction, this.networkGenerationHash);
        await this.transactionHttp.announce(signedTx).toPromise();

        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const txStatus = await this.transactionStatusHttp.getTransactionStatus(signedTx.hash).toPromise();
            if (transferTransaction.message.payload.length > 1023) throw new Error('FAILURE_MESSAGE_TOO_LARGE');
            else if (txStatus.group == 'failed') {
                throw new Error('FAILURE_INSUFFICIENT_BALANCE');
            }
        } catch (e) {
            return e;
        }
        return '';
    }

    /**
     * Adds to a transaction data mosaic definitions
     * @param mosaics array of mosaics
     * @return Promise with altered transaction
     */
    public async getMosaicsDefinition(mosaics: Mosaic[]): Promise<MosaicNames[]> {
        const mosaicIds = mosaics.map(_ => (_.id instanceof MosaicId) ? _.id : null);
        return await this.namespaceHttp.getMosaicsNames(mosaicIds).toPromise();
    }

    /**
     * Adds to a transaction data mosaic info
     * @param mosaics array of mosaics
     * @return Promise with altered transaction
     */
    public async getMosaicInfos(mosaics: Mosaic[]): Promise<MosaicInfo[]> {
        const mosaicIds = mosaics.map(_ => (_.id instanceof MosaicId) ? _.id : null);
        return await this.mosaicHttp.getMosaics(mosaicIds).toPromise();
    }

    /**
     * Get all confirmed transactions of an account
     * @param address account Address
     * @return Promise with account transactions
     */
    public async getAllTransactionsFromAnAccount(address: Address): Promise<Transaction[]> {
        const searchCriteria = { group: TransactionGroup.Confirmed, address };
        const transactions = await this.transactionHttp.search(searchCriteria).toPromise();
        return transactions.data.reverse();
    }

    /**
     * Get first confirmed transactions of an account
     * @param address account Address
     * @return Promise with account transactions
     */
    public async getFirstTransactionsFromAnAccount(address: Address): Promise<Transaction[]> {
        const searchCriteria = { group: TransactionGroup.Confirmed, address, pageNumber: 1, pageSize: 100 };
        const transactions = await this.transactionHttp.search(searchCriteria).toPromise();
        return transactions.data.reverse();
    }

    /**
     * Get all unconfirmed transactions of an account
     * @param address account Address
     * @return Promise with account transactions
     */
    public async getUnconfirmedTransactionsFromAnAccount(address: Address): Promise<Transaction[]> {
        const searchCriteria = { group: TransactionGroup.Unconfirmed, address, pageNumber: 1, pageSize: 100 };
        const transactions = await this.transactionHttp.search(searchCriteria).toPromise();
        return transactions.data.reverse();
    }

    /**
     * @return Promise with node status
     */
    public checkNodeIsAlive(): Promise<boolean> {
        return new Promise(resolve => {
            const route = this.node + '/node/info';
            setTimeout(function () {
                resolve(false)
            }, REQUEST_TIMEOUT);
            fetch(route, { method: 'GET' }).then(res => {
                if (res.status != 200) resolve(false);
                else resolve(true);
            }).catch(e => {
                resolve(false);
            });
        });
    }

    /**
     * Updates node status info
     */
    private updateNodeStatus() {
        this.checkNodeIsAlive().then(alive => {
            this.isNodeAlive = alive;
        });
    }

    /**
     * Check if private key is valid
     * @param privateKey
     */
    public isValidPrivateKey(privateKey: string) {
        try {
            Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET);
            return true;
        } catch (e) {
            return false;
        }
    }

    public async getEpochAdjustment(): Promise<number> {
        const epochAdjustment = await this.repositoryFactory.getEpochAdjustment().toPromise();
        return epochAdjustment;
    }
}
