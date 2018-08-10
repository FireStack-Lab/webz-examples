import { Component } from 'react'
import { connect } from 'dva'
import WrappedPrvKeyForm from './PrivateKeyForm'
import ConfirmWallet from './ConfirmWallet'
import { createAction } from '../../../utils'

class ImportWallet extends Component {
  state = {
    confirmNew: false
  }
  onConfirmNew = () => {
    this.setState({
      confirmNew: true
    })
  }
  renderWarning = () => {
    return (
      <div>
        <h3>
          You are about to Import a wallet, which will require you input your
          private key
        </h3>
        <h3>The wallet will import public key and address for you</h3>
        <h3>
          We currently don't support Json importion, just type in your key
        </h3>
        <WrappedPrvKeyForm
          handleSubmit={prvKey => {
            this.props.dispatch(
              createAction('wallet/importWalletFromPrivateKey')({ prvKey })
            )
            this.onConfirmNew()
          }}
        />
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

export default connect(mapStateToProps)(ImportWallet)
