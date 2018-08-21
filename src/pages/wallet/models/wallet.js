import Webz from '../../../services/webz'
import { createAction } from '../../../utils'
import { readObject, writeObject } from '../../../utils/storage'

const apis = {
  testRpc: 'http://127.0.0.1:4200',
  testNet: 'https://api-scilla.zilliqa.com',
  main: 'https://lookupv2.zilliqa.com/'
}
const apiUrl = apis.testNet

const webz = new Webz(apiUrl)

const walletTrim = /webz_wallet_id_/

export default {
  namespace: 'wallet',
  state: {
    localWallets: [],
    confirmWallet: {},
    confirmTransaction: {},
    loadingCreateWallet: false
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *getLocalWallets(_, { call, put }) {
      yield put(
        createAction('updateState')({
          loadingCreateWallet: true
        })
      )

      const walletList = []
      for (let i = 0; i < localStorage.length; i += 1) {
        const getKey = localStorage.key(i)

        if (getKey.match(walletTrim)) {
          const walletObject = readObject(getKey)
          const walletBalance = yield call(webz.getBalance, getKey.slice(15))
          const walletObjectToLocal = Object.assign({}, walletObject, {
            ...walletBalance
          })
          // console.log(Buffer.from(walletObject.prvKey))
          walletList.push(walletObjectToLocal)
        }
      }
      if (walletList.length > 0)
        yield put(
          createAction('updateState')({
            localWallets: walletList
          })
        )

      yield put(
        createAction('updateState')({
          loadingCreateWallet: false
        })
      )
    },
    *importWalletFromPrivateKey({ payload }, { call, put }) {
      const { prvKey } = payload

      const verifyPrivateKey = yield call(webz.verifyPrivateKey, prvKey)

      if (verifyPrivateKey) {
        const pubKey = yield call(webz.pubKey, prvKey)
        const address = yield call(webz.getAddress, prvKey)

        const saveNewWalletObject = {
          prvKey: prvKey.toString('hex'),
          pubKey: pubKey.toString('hex'),
          address
        }
        yield put(
          createAction('updateState')({ confirmWallet: saveNewWalletObject })
        )
      } else {
        yield put(createAction('updateState')({ isPrvKeyCorrect: false }))
      }
    },
    *saveToLocalWallets({ payload }, { call, put }) {
      const { prvKey, pubKey, address, walletName, walletPassWord } = payload
      const encryptPrvKey = yield call(webz.aesEncrypt, prvKey, walletPassWord)
      console.log(encryptPrvKey)
      const saveLocalWalletObject = {
        prvKey: encryptPrvKey,
        pubKey,
        address,
        walletName,
        importTime: new Date()
      }
      const walletKey = `webz_wallet_id_${saveLocalWalletObject.address}`
      yield call(writeObject, walletKey, saveLocalWalletObject)
      yield put({ type: 'getLocalWallets' })
    },
    *toConfirmTransaction({ payload }, { call, put }) {
      yield put(
        createAction('updateState')({
          confirmTransaction: { ...payload }
        })
      )
    },
    *makeTransaction({ payload }, { call, put }) {
      // console.log(payload)
      const { from, psw, ...txnDetails } = payload
      const walletKey = `webz_wallet_id_${from}`

      const localWallet = yield call(readObject, walletKey)
      // const localWalletBuffer = Buffer.from(localWallet.prvKey)
      // console.log(localWalletBuffer)
      const outputAes = yield call(webz.aesDecrypt, localWallet.prvKey, psw)
      console.log({ outputAes })
      let prvKey
      if (outputAes) {
        prvKey = outputAes.toString()
        // update nonce to double check
        const balanceInfo = yield call(webz.getBalance, from)
        const checkedTxnDetails = {
          ...txnDetails,
          nonce: balanceInfo.nonce + 1
          // should be edited to below after kaya upgrated
          // nonce: balanceInfo.nonce + 1
        }
        // console.log(prvKey)
        const txnJson = yield call(webz.txnJson, prvKey, checkedTxnDetails)
        yield put(createAction('doneTransaction')({ txnJson, from }))
      }
    },

    *doneTransaction({ payload }, { call, put }) {
      const { txnJson, from } = payload
      console.log(txnJson)
      const txnId = yield call(webz.createTransaction, txnJson)
      console.log(txnId)
      if (txnId) {
        const txnDate = new Date()
        const result = txnId
        //const { result } = txnId
        if (typeof result === 'string' && result.match(/^[0-9a-fA-F]{64}$/)) {
          const newTxnObject = Object.assign({}, txnJson, {
            txnId: result,
            from,
            txnCreateTime: txnDate,
            txnUpdateTime: txnDate,
            txnStatus: 'pending'
          })
          // console.log({ txnId, txnJson })

          yield call(writeObject, `transaction_id_${result}`, newTxnObject)
        }
      }
    },
    *createWallet(_, { call, put }) {
      const prvKey = yield call(webz.prvKey)
      const verifyPrivateKey = yield call(webz.verifyPrivateKey, prvKey)
      if (verifyPrivateKey) {
        const pubKey = yield call(webz.pubKey, prvKey)
        const address = yield call(webz.getAddress, prvKey)

        const saveNewWalletObject = {
          prvKey: prvKey.toString('hex'),
          pubKey: pubKey.toString('hex'),
          address
        }
        yield put(
          createAction('updateState')({ confirmWallet: saveNewWalletObject })
        )
      }
    },
    *resetPageObject(_, { put }) {
      yield put(
        createAction('updateState')({
          confirmWallet: {},
          confirmTransaction: {},
          loadingCreateWallet: false
        })
      )
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/wallet') {
          dispatch({ type: 'getLocalWallets', payload: query })
        }
      })
    }
  }
}
