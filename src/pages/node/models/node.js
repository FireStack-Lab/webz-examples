import Webz from '../services/node'

const apis = {
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
      balance: null,
      nonce: null
    },
    loadingNode: false,
    loadingWallet: false,
    total: null,
    page: null
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    save(
      state,
      {
        payload: { data: list, total, page }
      }
    ) {
      return { ...state, list, total, page }
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
            walletInfo: { ...getBalance }
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          loadingWallet: false
        }
      })
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
