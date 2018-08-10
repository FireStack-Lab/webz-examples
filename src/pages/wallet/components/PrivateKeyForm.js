import { Button, Input, Form } from 'antd'
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

const PrvKeyForm = ({ form, handleSubmit }) => (
  <Form>
    <FormItem>
      {form.getFieldDecorator('PrvKey', {
        rules: [
          {
            required: true,
            message: 'Please enter correct Private Key!'
          },
          {
            validator: (rule, value, callback) => {
              if (value.match(/^[0-9a-fA-F]{64}$/)) {
                callback()
                return true
              }
              callback('Private Key should 64 chars long!')
              return false
            }
          }
        ]
      })(
        <Input
          style={{ maxWidth: '100%' }}
          placeholder="Please enter correct Private Key"
        />
      )}
    </FormItem>
    <FormItem {...tailFormItemLayout}>
      <Button
        type="primary"
        onClick={() => {
          form.validateFields(['PrvKey'], (err, data) => {
            if (err === null) {
              const value = form.getFieldValue('PrvKey')
              handleSubmit(value)
            }
          })
        }}
      >
        Submit
      </Button>
    </FormItem>
  </Form>
)
const WrappedPrvKeyForm = Form.create()(PrvKeyForm)

export default WrappedPrvKeyForm
