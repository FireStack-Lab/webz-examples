import { List, Card, Spin, Row, Col } from 'antd'
import { connect } from 'dva'
import WrappedAddressForm from './WalletInfo'
import WrappedTxnForm from './TransactionInfo'
import WrappedTxBlockForm from './TxBlockInfo'
import WrappedDsBlockForm from './DsBlockInfo'

const DataItem = ({ name, item }) => (
  <Row gutter={8} style={{ overflow: 'hidden' }}>
    <Col span={12} style={{ fontWeight: '700' }}>
      {name}
    </Col>
    <Col span={12}>
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-all'
        }}
      >
        {item}
      </div>
    </Col>
  </Row>
)

const DataList = ({ data }) => {
  return data.map(d => <DataItem key={d.name} name={d.name} item={d.item} />)
}

const CardList = ({
  dispatch,
  nodeInfo,
  walletInfo,
  txnInfo,
  txBlock,
  dsBlock,
  loadingWallet,
  loadingNode,
  loadingTxnInfo,
  loadingTxBlock,
  loadingDsBlock
}) => {
  const { isConnected, libVersion, networkId, url } = nodeInfo
  const { balance, nonce } = walletInfo

  const walletInfoData = [
    { name: 'balance', item: balance },
    { name: 'nonce', item: nonce }
  ]

  const txnInfoData = [
    { name: 'Transaction ID', item: txnInfo.ID },
    { name: 'Zil Amount', item: txnInfo.amount },
    { name: 'nonce', item: txnInfo.nonce },
    { name: 'Sender Public Key', item: txnInfo.senderPubKey },
    { name: 'Signature', item: txnInfo.signature },
    { name: 'From Address', item: txnInfo.fromAddr },
    { name: 'To Address', item: txnInfo.toAddr },
    { name: 'version', item: txnInfo.version }
  ]

  const txBlockData = [
    {
      name: 'BlockNumber',
      item: txBlock.header ? txBlock.header.BlockNum : null
    },
    {
      name: 'DS BlockNumber',
      item: txBlock.header ? txBlock.header.DSBlockNum : null
    },
    {
      name: 'Gas Limit',
      item: txBlock.header ? txBlock.header.GasLimit : null
    },
    { name: 'Gas Used', item: txBlock.header ? txBlock.header.GasUsed : null },
    {
      name: 'Miner Pub Key',
      item: txBlock.header ? txBlock.header.MinerPubKey : null
    },
    {
      name: 'Number of MicroBlocks',
      item: txBlock.header ? txBlock.header.NumMicroBlocks : null
    },
    {
      name: 'Number of Transactions',
      item: txBlock.header ? txBlock.header.NumTxns : null
    },
    {
      name: 'State Hash',
      item: txBlock.header ? txBlock.header.StateHash : null
    },
    {
      name: 'Time Stamp',
      item: txBlock.header ? txBlock.header.Timestamp : null
    },
    {
      name: 'Transaction Hash',
      item: txBlock.header ? txBlock.header.TxnHash : null
    },
    {
      name: 'Previous Block Hash',
      item: txBlock.header ? txBlock.header.prevBlockHash : null
    },
    {
      name: 'Type',
      item: txBlock.header ? txBlock.header.type : null
    },
    {
      name: 'Version',
      item: txBlock.header ? txBlock.header.version : null
    },
    {
      name: 'Header Signature',
      item: txBlock.body ? txBlock.body.HeaderSign : null
    },
    {
      name: 'Micro Block Empty',
      item: txBlock.body ? txBlock.body.MicroBlockEmpty : null
    },
    {
      name: 'Micro Block Hashes',
      item: txBlock.body ? txBlock.body.MicroBlockHashes : null
    }
  ]

  const dsBlockData = [
    {
      name: 'BlockNumber',
      item: dsBlock.header ? dsBlock.header.blockNum : null
    },
    {
      name: 'Difficulty',
      item: dsBlock.header ? dsBlock.header.difficulty : null
    },
    {
      name: 'Leader Public Key',
      item: dsBlock.header ? dsBlock.header.leaderPubKey : null
    },
    {
      name: 'Miner Public Key',
      item: dsBlock.header ? dsBlock.header.minerPubKey : null
    },
    {
      name: 'Nonce',
      item: dsBlock.header ? dsBlock.header.nonce : null
    },
    {
      name: 'Previous Hash',
      item: dsBlock.header ? dsBlock.header.prevhash : null
    },
    {
      name: 'TimeStamp',
      item: dsBlock.header ? dsBlock.header.timestamp : null
    },
    {
      name: 'Signature',
      item: dsBlock.signature ? dsBlock.signature : null
    }
  ]

  const data = [
    {
      title: 'Wallet Info',
      content: (
        <div style={{ overflow: 'hidden' }}>
          <WrappedAddressForm
            handleSubmit={data =>
              dispatch({
                type: 'node/getWalletInfo',
                payload: { address: data }
              })
            }
          />
          {loadingWallet ? <Spin /> : <DataList data={walletInfoData} />}
        </div>
      )
    },
    {
      title: 'Transaction Info',
      content: (
        <div style={{ overflow: 'hidden' }}>
          <WrappedTxnForm
            handleSubmit={data =>
              dispatch({
                type: 'node/getTxnInfo',
                payload: { txHash: data }
              })
            }
          />
          {loadingTxnInfo ? <Spin /> : <DataList data={txnInfoData} />}
        </div>
      )
    },
    {
      title: 'TxBlock Info',
      content: (
        <div style={{ overflow: 'hidden' }}>
          <WrappedTxBlockForm
            handleSubmit={data =>
              dispatch({
                type: 'node/getTxBlockInfo',
                payload: { blockNumber: data }
              })
            }
          />
          {loadingTxBlock ? <Spin /> : <DataList data={txBlockData} />}
        </div>
      )
    },
    {
      title: 'DsBlock Info',
      content: (
        <div style={{ overflow: 'hidden' }}>
          <WrappedDsBlockForm
            handleSubmit={data =>
              dispatch({
                type: 'node/getDsBlockInfo',
                payload: { blockNumber: data }
              })
            }
          />
          {loadingDsBlock ? <Spin /> : <DataList data={dsBlockData} />}
        </div>
      )
    }
  ]
  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          padding: 16,
          marginBottom: 16,
          boxShadow: '3px 0px 3px #dddddd',
          minHeight: 60
        }}
      >
        {loadingNode ? (
          <Spin />
        ) : (
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            align="middle"
            justify="center"
          >
            <Col>
              <h1>{networkId}</h1>
            </Col>
            <Col>
              <span style={{ fontWeight: '700', marginRight: 8 }}>url:</span>
              <span>{url}</span>
            </Col>
            <Col>
              <span style={{ fontWeight: '700', marginRight: 8 }}>
                isConnected:
              </span>
              <span>{isConnected.toString()}</span>
            </Col>
            <Col>
              <span style={{ fontWeight: '700', marginRight: 8 }}>
                libVersion:
              </span>
              <span>{libVersion}</span>
            </Col>
          </Row>
        )}
      </div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card title={item.title}>
              <div style={{ minHeight: 200, maxWidth: '100%' }}>
                {item.content}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

function mapStateToProps(state) {
  const {
    nodeInfo,
    walletInfo,
    txnInfo,
    txBlock,
    dsBlock,
    loadingWallet,
    loadingNode,
    loadingTxnInfo,
    loadingTxBlock,
    loadingDsBlock
  } = state.node
  return {
    nodeInfo,
    walletInfo,
    txnInfo,
    txBlock,
    dsBlock,
    loadingWallet,
    loadingNode,
    loadingTxnInfo,
    loadingTxBlock,
    loadingDsBlock
  }
}

export default connect(mapStateToProps)(CardList)
