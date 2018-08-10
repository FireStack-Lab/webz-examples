import { Component } from 'react'
import { Button } from 'antd'
import { connect } from 'dva'
import ConfirmWallet from './ConfirmWallet'
import { createAction } from '../../../utils'

class NewWallet extends Component {
  state = {
    confirmNew: false
  }
  onConfirmNew = () => {
    this.props.dispatch(createAction('wallet/createWallet')())
    this.setState({
      confirmNew: true
    })
  }
  renderWarning = () => {
    return (
      <div>
        <h3>
          You are about to Create a new wallet, which will contains a pair of
          keys(public key and private key), and an address that represent your
          wallet.
        </h3>
        <h3>Press Next button then you will proceed to the next step</h3>
        <h3>
          Remember to print the PDF and DO NOT tell anyone your private key
        </h3>
        <Button onClick={this.onConfirmNew} type="primary">
          Next
        </Button>
      </div>
    )
  }
  renderKeys = () => (
    <ConfirmWallet
      onCancel={this.props.onCancel}
      confirmWallet={this.props.confirmWallet}
      saveToLocalWallets={wallet => {
        this.props.dispatch(createAction('wallet/saveToLocalWallets')(wallet))
      }}
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
    localWallets: state.wallet.localWallets,
    confirmWallet: state.wallet.confirmWallet
  }
}

export default connect(mapStateToProps)(NewWallet)
