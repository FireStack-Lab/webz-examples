import React, { Component } from 'react'
import { Form, Input, InputNumber, Button } from 'antd'
const FormItem = Form.Item

const TransactionForm = ({
  form,
  onCancel,
  onSubmit,
  balance,
  nonceForNow,
  currentAddress
}) => {
  return (
    <Form>
      <FormItem label="To" hasFeedback>
        {form.getFieldDecorator('ToAddress', {
          rules: [
          {
              required: true,
              message: 'Please enter correct Address!'
          },
          {
            validator: (rule, value, callback) => {
              if (
                  value &&
                value.match(/^[0-9a-fA-F]{40}$/) &&
                  value !== currentAddress
              ) {
                callback()
              }
              callback(
                  'Address should be numbers or chars, and NOT the wallet address above!'
              )
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <Input
              size="large"
              placeholder="Address to transaction"
              disabled={!balance}
            />
          </div>
        )}
      </FormItem>
      <FormItem label="Amount" hasFeedback>
        {form.getFieldDecorator('Amount', {
          rules: [
          {
              required: true,
              message: 'Please enter correct Amount!'
          },
          {
            validator: (rule, value, callback) => {
              if (value) {
                form.validateFields(['Gas Limit'], { force: true })
              }
              callback()
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <InputNumber
              // defaultValue={0}
              min={1}
              max={balance}
              step={1}
              size="large"
              placeholder="Amount that less than Balance"
              style={{ width: '100%' }}
              disabled={!balance}
            />
          </div>
        )}
      </FormItem>
      <FormItem label="Gas Limit" hasFeedback>
        {form.getFieldDecorator('Gas Limit', {
          rules: [
          {
              required: true,
              message: 'Please enter correct Gas Limit!'
          },
          {
            validator: (rule, value, callback) => {
              const amount = form.getFieldValue('Amount')

              if (
                  value &&
                parseInt(value, 10) + parseInt(amount, 10) <= balance
              ) {
                callback()
              } else {
                callback('amount + gas limit < balance')
              }
              callback()
            }
          }
          ]
        })(
          <div style={{ marginTop: 16 }}>
            <InputNumber
              // defaultValue={1}
              min={1}
              max={balance}
              step={1}
              size="large"
              placeholder="Gas Limit that nodes will process"
              style={{ width: '100%' }}
              disabled={!balance}
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
            form.validateFields(
              ['ToAddress', 'Amount', 'Gas Limit'],
              (err, data) => {
                if (err === null) {
                  const to = form.getFieldValue('ToAddress')
                  const amount = parseInt(form.getFieldValue('Amount'), 10)
                  const gasLimit = parseInt(form.getFieldValue('Gas Limit'), 10)
                  const nonce = nonceForNow + 1
                  const from = currentAddress
                  onSubmit({
                    from,
                    to,
                    amount,
                    gasLimit,
                    nonce
                  })
                }
              }
            )
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
const WrappedTransactionFrom = Form.create()(TransactionForm)

class TransactionFromClass extends Component {
  onSubmitForm = data => {
    this.props.onSubmit(data)
  }
  render() {
    return (
      <WrappedTransactionFrom
        confirmWallet={this.props.confirmWallet}
        onCancel={this.props.onCancel}
        onSubmit={this.onSubmitForm}
        balance={this.props.walletInfo.balance}
        nonceForNow={this.props.walletInfo.nonce}
        currentAddress={this.props.walletInfo.address}
      />
    )
  }
}

export default TransactionFromClass
