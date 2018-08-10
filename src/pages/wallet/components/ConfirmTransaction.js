import { Divider, Button, Form, Input } from 'antd'
const FormItem = Form.Item

const InputPassWord = ({
  form,
  from,
  to,
  balance,
  amount,
  nonce,
  gasLimit,
  onSubmit,
  onCancel
}) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('walletPassWord', {
        rules: [
          {
            required: true,
            message: 'Please enter correct password!'
          }
        ]
      })(
        <div style={{ marginTop: 16 }}>
          <h3>Input Wallet Password</h3>
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
          const psw = form.getFieldValue('walletPassWord')
          const txnDetails = {
            from,
            to,
            version: 0,
            nonce,
            amount,
            gasPrice: 1,
            gasLimit,
            psw
          }
          onSubmit(txnDetails)
        }}
        type="primary"
        // disabled={buttonState}
      >
        Submit
      </Button>
    </div>
  </Form>
)

const InputPassWordWrapper = Form.create()(InputPassWord)

const ConfirmTransaction = ({ confirmTransaction, onCancel, onSubmit }) => {
  const { from, to, balance, amount, gasLimit } = confirmTransaction
  return (
    <div style={{ paddingBottom: 32 }}>
      <h2>Please Confirm Your Transaction</h2>
      <h3 style={{ color: '#f25718' }}>
        Caution: We can't promise that all transaction to be made
      </h3>
      <h3 style={{ color: '#f25718' }}>
        Caution: Actual Gas Spence will be determined by transaction nodes
      </h3>
      <Divider />
      <InputPassWordWrapper
        {...confirmTransaction}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
      <Divider />
      <h3>From Address:</h3>
      <p>{from}</p>
      <h3>Current Balance:</h3>
      <p>{balance}</p>
      <Divider />
      <h3>To Address:</h3>
      <p>{to}</p>
      <h3>Amount:</h3>
      <p>{amount}</p>
      <h3>Gas Limit:</h3>
      <p>{gasLimit}</p>
    </div>
  )
}

export default ConfirmTransaction
