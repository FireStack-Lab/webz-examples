import { Input, Form, Button } from 'antd'

const FormItem = Form.Item

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 0
    }
  }
}

const TxnForm = ({ form, handleSubmit }) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('TxnHash', {
        rules: [
        {
            required: true,
            message: 'Please enter correct TxnHash!'
        },
        {
          validator: (rule, value, callback) => {
            if (value.match(/^[0-9a-fA-F]{64}$/)) {
              callback()
                return true
            }
            callback('TxnHash should be 64 chars long!')
              return false
          }
        }
        ]
      })(
        <Input
          style={{ maxWidth: '100%' }}
          placeholder="Please enter correct TxnHash"
        />
      )}
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Button
        type="primary"
        onClick={() => {
          const value = form.getFieldValue('TxnHash')
          handleSubmit(value)
        }}
      >
        Submit
      </Button>
    </FormItem>
  </Form>
)
const WrappedTxnForm = Form.create()(TxnForm)

export default WrappedTxnForm
