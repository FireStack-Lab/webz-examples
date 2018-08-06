import Webz from 'webz.js'

class ZilService {
  constructor(nodeUrl) {
    this.nodeUrl = nodeUrl
    this.Webz = this.init(nodeUrl)
  }

  // initialize WebzNode
  init = nodeUrl => new Webz({ nodeUrl })

  // aesEncrypt
  aesEncrypt = (data, key, iv) => {
    const result = this.Webz.util.aes.encipher(
      Buffer.alloc(data.toString().length, data.toString()),
      Buffer.alloc(32, key),
      Buffer.alloc(16, iv)
    )
    return result
  }
  // aesEncrypt
  aesDecrypt = (data, key, iv) => {
    const result = this.Webz.util.aes.decipher(
      data,
      Buffer.alloc(32, key),
      Buffer.alloc(16, iv)
    )
    return result
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
    const result = this.Webz.getNode()
    return result
  }

  // get library version
  libVersion = () => {
    const result = this.Webz.getLibraryVersion()
    return result
  }

  // get node isConnected boolean
  isConnected = async () => {
    const result = await this.node().isConnected()
    return result !== null ? true : false
  }

  // get networkId from node
  networkId = async () => {
    const result = await this.node().getNetworkId()
    return result
  }

  // get Balance
  getBalance = async address => {
    const result = await this.node().getBalance({ address })
    return result
  }

  // get transaction
  getTransaction = async txHash => {
    const result = await this.node().getTransaction({ txHash })
    return result
  }

  // get txBlock
  getTxBlock = async blockNumber => {
    const result = await this.node().getTxBlock({ blockNumber })
    return result
  }

  // get dsBlock
  getDsBlock = async blockNumber => {
    const result = await this.node().getDsBlock({ blockNumber })
    return result
  }

  // get SmartContracts
  getSmartContracts = async address => {
    const result = await this.node().getSmartContracts({ address })
    return result
  }

  // createTransaction
  createTransaction = async txnJson => {
    const result = await this.node().createTransaction(txnJson)
    return result
  }

  // getTransactionHistory
  getTransactionHistory = async address => {
    const result = await this.node().getTransactionHistory({ address })
    return result
  }
}

export default ZilService
