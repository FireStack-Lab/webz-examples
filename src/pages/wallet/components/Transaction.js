import { Component } from 'react'
import { connect } from 'dva'
import { Form, Select } from 'antd'
import TransactionForm from './TransactionForm'
import ConfirmTransaction from './ConfirmTransaction'
import { createAction } from '../../../utils'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = null

const SelectLocalWallet = ({ form, onSubmit, wallets, walletInfo }) => {
  const OptionList = wallets.map(d => (
    <Option value={d.address} key={d.address}>
      {d.walletName}
    </Option>
  ))

  return (
    <Form onSubmit={onSubmit}>
      <FormItem {...formItemLayout} label="From" hasFeedback>
        {form.getFieldDecorator('select', {
          rules: [{ required: true, message: 'Please select a wallet!' }]
        })(<Select placeholder="Please select a wallet">{OptionList}</Select>)}
      </FormItem>
      <FormItem>
        <div>Balance: {walletInfo.balance}</div>
        <div>Nonce: {walletInfo.nonce}</div>
      </FormItem>
    </Form>
  )
}

const WrappedSelectLocalWallet = Form.create({
  onFieldsChange: (props, fields) => {
    props.dispatch(
      createAction('node/getWalletInfo')({ address: fields.select.value })
    )
  }
})(SelectLocalWallet)

class Transaction extends Component {
  state = {
    confirmNew: false
  }
  onConfirmNew = () => {
    this.setState({
      confirmNew: true
    })
  }
  onBack = () => {
    this.props.dispatch(createAction('node/resetPageObject')())
    this.props.dispatch(createAction('wallet/resetPageObject')())
    this.setState({
      confirmNew: false
    })
  }
  renderWarning = () => {
    return (
      <div style={{ paddingBottom: 32 }}>
        <h3>Choose your wallet</h3>
        <WrappedSelectLocalWallet
          wallets={this.props.localWallets}
          walletInfo={this.props.walletInfo}
          dispatch={this.props.dispatch}
        />
        <h3>Transaction To: </h3>
        <TransactionForm
          walletInfo={this.props.walletInfo}
          onCancel={this.props.onCancel}
          onSubmit={data => {
            // console.log(data)
            this.props.dispatch(
              createAction('wallet/toConfirmTransaction')({
                ...data,
                balance: this.props.walletInfo.balance
              })
            )
            this.onConfirmNew()
          }}
        />
      </div>
    )
  }
  renderKeys = () => (
    <ConfirmTransaction
      confirmTransaction={this.props.confirmTransaction}
      onCancel={this.onBack}
      onSubmit={data =>
        this.props.dispatch(createAction('wallet/makeTransaction')(data))
      }
    />
  )

  render() {
    const { confirmNew } = this.state

    return (
      <div>
        {confirmNew === false ? this.renderWarning() : this.renderKeys()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    walletInfo: state.node.walletInfo,
    localWallets: state.wallet.localWallets,
    confirmTransaction: state.wallet.confirmTransaction
  }
}

export default connect(mapStateToProps)(Transaction)
