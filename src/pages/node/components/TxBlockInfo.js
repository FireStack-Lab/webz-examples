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

const TxBlockForm = ({ form, handleSubmit }) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('TxBlockNumber', {
        rules: [
          {
            required: true,
            message: 'Please enter correct TxBlockNumber!'
          },
          {
            validator: (rule, value, callback) => {
              if (value.match(/^[0-9]/)) {
                callback()
                return true
              }
              callback('TxBlockNumber should be numbers!')
              return false
            }
          }
        ]
      })(
        <Input
          style={{ maxWidth: '100%' }}
          placeholder="Please enter correct TxBlockNumber"
        />
      )}
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Button
        type="primary"
        onClick={() => {
          const value = form.getFieldValue('TxBlockNumber')
          handleSubmit(value)
        }}
      >
        Submit
      </Button>
    </FormItem>
  </Form>
)
const WrappedTxBlockForm = Form.create()(TxBlockForm)

export default WrappedTxBlockForm
