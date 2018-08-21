import Webz from '../../../services/webz'
import { createAction } from '../../../utils'

const apis = {
  testRpc: 'http://127.0.0.1:4200',
  testNet: 'https://api-scilla.zilliqa.com',
  main: 'https://lookupv2.zilliqa.com/'
}
const apiUrl = apis.testNet

const webz = new Webz(apiUrl)

export default {
  namespace: 'node',
  state: {
    nodeInfo: {
      url: null,
      isConnected: false,
      libVersion: null,
      networkId: null
    },
    walletInfo: {
      address: null,
      balance: null,
      nonce: null
    },
    txnInfo: {},
    dsBlock: {},
    txBlock: {},
    loadingNode: false,
    loadingWallet: false,
    loadingTxnInfo: false,
    loadingDsBlock: false,
    loadingTxBlock: false,
    total: null,
    page: null
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          loadingNode: true
        }
      })
      const getNode = yield call(webz.node)
      const isConnected = yield call(webz.isConnected)
      const libVersion = yield call(webz.libVersion)
      const networkId = yield call(webz.networkId)
      yield put({
        type: 'updateState',
        payload: {
          nodeInfo: {
            isConnected,
            libVersion,
            networkId,
            url: getNode.url
          }
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          loadingNode: false
        }
      })
    },
    *getWalletInfo({ payload }, { call, put }) {
      // console.log(payload)
      yield put({
        type: 'updateState',
        payload: {
          loadingWallet: true
        }
      })
      const { address } = payload

      const getBalance = yield call(webz.getBalance, address)
      if (getBalance) {
        yield put({
          type: 'updateState',
          payload: {
            walletInfo: { ...getBalance, address }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingWallet: false
        }
      })
    },
    *getTxnInfo({ payload }, { call, put }) {
      // console.log(payload)
      yield put({
        type: 'updateState',
        payload: {
          loadingTxnInfo: true
        }
      })
      const { txHash } = payload

      const getTransaction = yield call(webz.getTransaction, txHash)

      if (getTransaction) {
        const { senderPubKey } = getTransaction

        const fromAddr =
          senderPubKey !== undefined
            ? yield call(webz.getAddressFromPublicKey, senderPubKey)
            : null
        yield put({
          type: 'updateState',
          payload: {
            txnInfo: { ...getTransaction, fromAddr }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingTxnInfo: false
        }
      })
    },
    *getTxBlockInfo({ payload }, { call, put }) {
      // console.log(payload)
      yield put({
        type: 'updateState',
        payload: {
          loadingTxBlock: true
        }
      })
      const { blockNumber } = payload

      const getTxBlock = yield call(webz.getTxBlock, blockNumber)

      if (getTxBlock) {
        yield put({
          type: 'updateState',
          payload: {
            txBlock: { ...getTxBlock }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingTxBlock: false
        }
      })
    },
    *getDsBlockInfo({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          loadingDsBlock: true
        }
      })
      const { blockNumber } = payload

      const getDsBlock = yield call(webz.getDsBlock, blockNumber)
      if (getDsBlock) {
        yield put({
          type: 'updateState',
          payload: {
            dsBlock: { ...getDsBlock }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingDsBlock: false
        }
      })
    },
    *resetPageObject(_, { put }) {
      yield put(
        createAction('updateState')({
          walletInfo: { Balance: null, nonce: null },
          txnInfo: {},
          dsBlock: {},
          txBlock: {},
          loadingNode: false,
          loadingWallet: false,
          loadingTxnInfo: false,
          loadingDsBlock: false,
          loadingTxBlock: false
        })
      )
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/node') {
          dispatch({ type: 'fetch', payload: query })
        }
      })
    }
  }
}
