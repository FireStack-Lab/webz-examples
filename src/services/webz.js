import Webz from 'webz.js'
import CryptoJS from 'crypto-js'

class ZilService {
  constructor(nodeUrl) {
    this.nodeUrl = nodeUrl
    this.Webz = this.init(nodeUrl)
  }
  // initialize WebzNode
  // init = nodeUrl => new Webz({ nodeUrl })
  init = nodeUrl => new Webz(nodeUrl)

  // aesEncrypt
  aesEncrypt = (data, key) => {
    const ciphertext = CryptoJS.AES.encrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(0),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return ciphertext.toString()
  }
  // aesDecrypt
  aesDecrypt = (data, key) => {
    var decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: CryptoJS.enc.Hex.parse(0),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8) //WordArray对象转utf8字符串
  }

  // generate private key
  prvKey = () => {
    const result = this.Webz.util.generatePrivateKey()
    return result
  }

  // generate pubkey using privateKey
  pubKey = prvKey => {
    const result = this.Webz.util.getPubKeyFromPrivateKey(prvKey)
    return result
  }

  // veiryfy privatekey that generated
  verifyPrivateKey = prvKey => {
    const result = this.Webz.util.verifyPrivateKey(prvKey)
    return result
  }

  // get address that privatekey is about
  getAddress = async prvKey => {
    const result = this.Webz.util.getAddressFromPrivateKey(prvKey)
    return result
  }

  getAddressFromPublicKey = async pubKey => {
    const result = this.Webz.util.getAddressFromPublicKey(pubKey)
    return result
  }

  txnJson = async (prvKey, txnObject) => {
    const result = await this.Webz.util.createTransactionJson(prvKey, txnObject)
    return result
  }

  // node apis
  // get connected node
  node = () => {
    const result = this.Webz.getProvider()
    return result
  }

  httpProvider = async () => {
    await this.Webz.setProvider('https://api-scilla.zilliqa.com')
    const result = await this.Webz.zil.isConnected()
    return result
  }

  // get library version
  libVersion = () => {
    const result = this.Webz.getLibraryVersion()
    return result
  }

  // get node isConnected boolean
  isConnected = async () => {
    const result = await this.Webz.isConnected()
    return result !== null ? true : false
  }

  // get networkId from node
  networkId = async () => {
    const result = await this.Webz.zil.getNetworkId()
    return result
  }

  // get Balance
  getBalance = async address => {
    const result = await this.Webz.zil.getBalance({ address })

    return result
  }

  // get transaction
  getTransaction = async txHash => {
    const result = await this.Webz.zil.getTransaction({ txHash })
    return result
  }

  // get txBlock
  getTxBlock = async blockNumber => {
    // const result = await this.node().getTxBlock({ blockNumber })
    const result = await this.Webz.zil.getTxBlock({ blockNumber })

    return result
  }

  // get dsBlock
  getDsBlock = async blockNumber => {
    // const result = await this.node().getDsBlock({ blockNumber })
    const result = await this.Webz.zil.getDsBlock({ blockNumber })
    return result
  }

  // get SmartContracts
  getSmartContracts = async address => {
    const result = await this.Webz.zil.getSmartContracts({ address })
    return result
  }

  // createTransaction
  createTransaction = async txnJson => {
    const result = await this.Webz.zil.createTransaction(txnJson)
    return result
  }

  // getTransactionHistory
  getTransactionHistory = async address => {
    const result = await this.Webz.zil.getTransactionHistory({ address })
    return result
  }
  // HttpProvider
}

export default ZilService
