import Webz from '../../../services/webz'
import { createAction } from '../../../utils'
import { readObject, writeObject } from '../../../utils/storage'

const apis = {
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
          // console.log(Buffer.from(walletObject.prvKey))
          walletList.push(walletObject)
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
      const encryptPrvKey = yield call(
        webz.aesEncrypt,
        prvKey,
        walletPassWord,
        0
      )
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
      //
      // const outputAes = yield call(
      //   webz.aesDecrypt,
      //   Buffer.alloc(
      //     saveLocalWalletObject.keyLength,
      //     saveLocalWalletObject.prvKey,
      //     'utf-8'
      //   ),
      //   walletPassWord,
      //   0
      // )
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
    }
    // *getWalletInfo({ payload }, { call, put }) {
    //   // console.log(payload)
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       loadingWallet: true
    //     }
    //   })
    //   const { address } = payload
    //
    //   const getBalance = yield call(webz.getBalance, address)
    //
    //   if (getBalance) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         walletInfo: { ...getBalance }
    //       }
    //     })
    //   }
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       loadingWallet: false
    //     }
    //   })
    // }
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
