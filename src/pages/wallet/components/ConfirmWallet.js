import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
const FormItem = Form.Item

const ConfirmWalletForm = ({
  form,
  onCancel,
  onSubmit,
  buttonState,
  confirmWallet: { prvKey, pubKey, address }
}) => {
  return (
    <Form>
      <div style={{ marginTop: 16 }}>
        <h3>Private Key</h3>
        <Input size="large" value={prvKey} disabled />
      </div>
      <div style={{ marginTop: 16 }}>
        <h3>Public Key</h3>
        <Input size="large" value={pubKey} disabled />
      </div>
      <div style={{ marginTop: 16 }}>
        <h3>Address</h3>
        <Input size="large" value={address} disabled />
      </div>

      <FormItem>
        {form.getFieldDecorator('walletName', {
          rules: [
          {
              required: true,
              message: 'Please enter correct Wallet Name!'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.match(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)) {
                callback()
                  return true
              }
              callback('Wallet Name should be numbers or chars!')
                return false
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <h3>Wallet Name</h3>
            <Input size="large" placeholder="Give Wallet A Name" />
          </div>
        )}
      </FormItem>
      <FormItem>
        {form.getFieldDecorator('walletPassWord', {
          rules: [
          {
              required: true,
              message: 'Please enter correct password!'
          },
          {
            validator: (rule, value, callback) => {
              if (value) {
                form.validateFields(['walletPassWord2'], { force: true })
              }
              callback()
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <h3>Password</h3>
            <Input
              size="large"
              placeholder="Enter Wallet Password"
              type="password"
            />
          </div>
        )}
      </FormItem>
      <FormItem>
        {form.getFieldDecorator('walletPassWord2', {
          rules: [
          {
              required: true,
              message: 'Please enter correct password!'
          },
          {
            validator: (rule, value, callback) => {
              if (value && value !== form.getFieldValue('walletPassWord')) {
                callback('Two passwords that you enter is inconsistent!')
              } else {
                callback()
              }
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <h3>Confirm Password</h3>
            <Input
              size="large"
              placeholder="Enter Wallet Password"
              type="password"
            />
          </div>
        )}
      </FormItem>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }}
      >
        <Button
          style={{
            marginRight: 8
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            form.validateFields(['walletName'], (err, data) => {
              if (err === null) {
                const walletName = form.getFieldValue('walletName')
                const walletPassword = form.getFieldValue('walletPassword')
                onSubmit({ walletName, walletPassword })
              }
            })
          }}
          type="primary"
          // disabled={buttonState}
        >
          Submit
        </Button>
      </div>
    </Form>
  )
}
const WrappedConfirmForm = Form.create()(ConfirmWalletForm)

class ConfirmWallet extends Component {
  state = {
    // buttonState: true
  }
  onSubmitForm = ({ walletName }) => {
    const walletObject = {
      ...this.props.confirmWallet,
      walletName
    }
    this.props.saveToLocalWallets(walletObject)
    this.props.onCancel()
  }
  render() {
    return (
      <WrappedConfirmForm
        confirmWallet={this.props.confirmWallet}
        onCancel={this.props.onCancel}
        onSubmit={this.onSubmitForm}
        // buttonState={this.state.buttonState}
      />
    )
  }
}

export default ConfirmWallet
