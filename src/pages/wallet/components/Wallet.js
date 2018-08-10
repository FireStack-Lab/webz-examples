import { Component } from 'react'
import { List, Card, Button, Drawer, Icon, Avatar, Divider } from 'antd'
import { connect } from 'dva'
import { createAction } from '../../../utils'
import NewWallet from './NewWallet'
import ImportWallet from './ImportWallet'
import Transaction from './Transaction'

class Wallet extends Component {
  state = {
    modalTitle: null,
    modalVisible: false,
    confirmLoading: false,
    modalType: null
  }
  onImportButton = () => {
    this.setState({
      modalType: 'importWallet',
      modalVisible: true,
      modalTitle: 'Import Wallet'
    })
  }
  onCreateButton = () => {
    this.setState({
      modalType: 'newWallet',
      modalVisible: true,
      modalTitle: 'Create Wallet'
    })
  }
  onTransactionButton = () => {
    this.props.dispatch(createAction('wallet/resetPageObject')())
    this.setState({
      modalType: 'makeTransaction',
      modalVisible: true,
      modalTitle: 'Make Transaction'
    })
  }
  handleOk = () => {
    this.setState({
      confirmLoading: true
    })
    setTimeout(() => {
      this.setState({
        modalType: null,
        modalTitle: null,
        modalVisible: false
      })
    }, 2000)
  }
  handleCancel = () => {
    this.props.dispatch(createAction('node/resetPageObject')())
    this.props.dispatch(createAction('wallet/resetPageObject')())
    this.setState({
      modalType: null,
      modalTitle: null,
      modalVisible: false,
      keyList: []
    })
  }
  renderModalComponent = ({ onCancel, onSubmit }) => {
    const { modalType } = this.state
    let result = null
    switch (modalType) {
      case 'newWallet':
        result = <NewWallet onCancel={onCancel} onSumbmit={onSubmit} />
        break
      case 'importWallet':
        result = <ImportWallet onCancel={onCancel} onSumbmit={onSubmit} />
        break
      case 'makeTransaction':
        result = (
          <Transaction
            onCancel={onCancel}
            onSubmit={() => console.log('transaction')}
          />
        )
        break
      default:
        result = null
    }
    return result
  }

  IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  )
  render() {
    const data = [
      {
        title: 'create wallet',
        content: (
          <Button type="primary" size="large" onClick={this.onCreateButton}>
            Create Wallet
          </Button>
        )
      },
      {
        title: 'import wallet',
        content: (
          <Button size="large" onClick={this.onImportButton}>
            Import Wallet
          </Button>
        )
      },
      {
        title: 'Make Transaction',
        content: (
          <Button size="large" onClick={this.onTransactionButton}>
            Make Transaction
          </Button>
        )
      },
      {
        title: 'Export Wallets',
        content: (
          <Button size="large" onClick={() => console.log('export wallet')}>
            Export Wallets
          </Button>
        )
      }
    ]
    const IconText = this.IconText

    return (
      <div>
        <Divider />
        <h2
          style={{
            marginTop: 16,
            marginBottom: 16
          }}
        >
          Actions
        </h2>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Card title={item.title}>
                <div style={{ maxWidth: '100%' }}>{item.content}</div>
              </Card>
            </List.Item>
          )}
        />
        <Divider />
        <h2
          style={{
            marginTop: 16,
            marginBottom: 16
          }}
        >
          Wallets
        </h2>

        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page)
            },
            pageSize: 3
          }}
          dataSource={this.props.localWallets}
          renderItem={item => (
            <List.Item
              key={item.address}
              actions={[
                <IconText type="wallet" text={item.balance} />,
                <IconText type="check-circle-o" text={item.nonce} />
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <a
                    href={item.href}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-all'
                    }}
                  >
                    {`Wallet Name: ${item.walletName}`}
                  </a>
                }
                description={`Address: ${item.address}`}
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-all'
                }}
              >
                {`Public Key: ${item.pubKey}`}
              </span>
            </List.Item>
          )}
        />
        <Drawer
          width={window.screen.availWidth <= 640 ? '100%' : 640}
          title={this.state.modalTitle}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onClose={this.handleCancel}
          placement="left"
          closable={false}
        >
          {this.renderModalComponent({
            onCancel: this.handleCancel,
            onSubmit: this.handleCancel
          })}
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { localWallets: state.wallet.localWallets }
}

export default connect(mapStateToProps)(Wallet)
